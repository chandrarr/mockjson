import { parseEDI } from '../lib/edi-parser';
import { SAMPLES } from '../lib/samples';

function test() {
  SAMPLES.forEach(sample => {
    console.log(`Testing: ${sample.name}`);
    const result = parseEDI(sample.content);
    if (result.length > 0) {
      console.log(`✅ Success: ${result.length} segments found.`);
    } else {
      console.log(`❌ Failure: No segments found.`);
    }
    // Print first segment as a sample
    if (result.length > 0) {
        console.log('First segment sample:', JSON.stringify(result[0], null, 2));
    }
    console.log('-------------------');
  });
}

test();
