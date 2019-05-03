import {expect} from "chai";
import {readFileSync} from "fs";
import {join} from "path";
import { OUTPUT_DIR } from "./index.spec";


export function testAutoAssign(err) {
    expect(!!err).to.be.false;
    const htmlFile = join(OUTPUT_DIR, './index.html');
    const htmlContents = readFileSync(htmlFile).toString();
    expect(!!htmlContents).to.be.true;
    expect(/href="styles\.css"[^>]*?type="text\/css"/
        .test(htmlContents)).to.be.true;
    expect(/src="app\.js"/
        .test(htmlContents)).to.be.true;
}


export function testTypeOverride(err) {
    expect(!!err).to.be.false;
    const htmlFile = join(OUTPUT_DIR, './index.html');
    const htmlContents = readFileSync(htmlFile).toString();
    expect(!!htmlContents).to.be.true;
    expect(/href="styles\.css"[^>]*?type="testtype"/
        .test(htmlContents)).to.be.true;
    expect(/src="app\.js"/
        .test(htmlContents)).to.be.true;
}
