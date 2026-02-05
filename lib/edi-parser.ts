export interface EDISegment {
  tag: string;
  elements: (string | string[])[];
}

export function parseEDI(content: string): EDISegment[] {
  const cleanContent = content.trim();

  if (cleanContent.startsWith('ISA')) {
    return parseX12(cleanContent);
  } else if (cleanContent.startsWith('UNA') || cleanContent.startsWith('UNB')) {
    return parseEDIFACT(cleanContent);
  } else {
    // Fallback to a generic parser
    return genericParse(cleanContent);
  }
}

function parseX12(content: string): EDISegment[] {
  // ISA is 106 chars long
  const elementSeparator = content[3];
  const segmentTerminator = content[105];
  const componentSeparator = content[104];

  const segments = content.split(segmentTerminator);

  return segments
    .map(seg => seg.trim())
    .filter(seg => seg.length > 0)
    .map(seg => {
      const elements = seg.split(elementSeparator);
      const processedElements = elements.slice(1).map(el => {
        if (el.includes(componentSeparator) && componentSeparator !== elementSeparator) {
          return el.split(componentSeparator);
        }
        return el;
      });
      return {
        tag: elements[0],
        elements: processedElements
      };
    });
}

function parseEDIFACT(content: string): EDISegment[] {
  let segmentTerminator = "'";
  let elementSeparator = "+";
  let componentSeparator = ":";

  let data = content;
  if (content.startsWith('UNA')) {
    // UNA: component, element, decimal, release, reserved, segment
    componentSeparator = content[3];
    elementSeparator = content[4];
    // decimal = content[5]
    // release = content[6]
    // reserved = content[7]
    segmentTerminator = content[8];
    data = content.substring(9);
  }

  const segments = data.split(segmentTerminator);

  return segments
    .map(seg => seg.trim())
    .filter(seg => seg.length > 0)
    .map(seg => {
      const elements = seg.split(elementSeparator);
      const processedElements = elements.slice(1).map(el => {
        if (el.includes(componentSeparator)) {
          return el.split(componentSeparator);
        }
        return el;
      });
      return {
        tag: elements[0],
        elements: processedElements
      };
    });
}

function genericParse(content: string): EDISegment[] {
  // Try to guess separators
  const lines = content.split(/[\r\n~']+/);
  return lines
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // Guess element separator: * or + or |
      let sep = '*';
      if (line.includes('+')) sep = '+';
      else if (line.includes('|')) sep = '|';

      const elements = line.split(sep);
      return {
        tag: elements[0],
        elements: elements.slice(1)
      };
    });
}
