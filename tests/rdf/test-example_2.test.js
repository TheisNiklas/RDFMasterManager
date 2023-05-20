import { TestSample } from "../../src/rdf/test-sample";

describe('TestSample', () => {
    test('get', () => {
        let test = new TestSample()
        expect(test.get()).toBe("Hello")
    })
})