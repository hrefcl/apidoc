/**
 * Test: Parser
 */
import assert from 'assert';
import Parser from '../../../lib/core/parser';
import {logger, app} from './app';

const testCases = [
  {
    title: 'should detect basic parameters',
    testBlock: '@apiVersion 3.0.0',
    expected: [
      {
        source: '@apiVersion 3.0.0',
        name: 'apiversion',
        sourceName: 'apiVersion',
        content: '3.0.0'
      },
    ]
  },
  {
    title: 'should not detect @ in parameters values',
    testBlock: `@apiParamExample {json} Some json code:
      {
        "user": "Sample User",
         "payload": {
           "test": [
             "code": "
               public class HelloWorldTest {
                 HelloWorld hw = new HelloWorld();
                 @Test
                 public void testOkay {
                 assertEquals(\"HelloWorld\", hw.getMsg());
               }
            }"
           ]
         }
      }`,
    expected: [
      {
      source: '@apiParamExample {json} Some json code:\n' +
        '      {\n' +
        '        "user": "Sample User",\n' +
        '         "payload": {\n' +
        '           "test": [\n' +
        '             "code": "\n' +
        '               public class HelloWorldTest {\n' +
        '                 HelloWorld hw = new HelloWorld();\n' +
        '                 @Test\n' +
        '                 public void testOkay {\n' +
        '                 assertEquals("HelloWorld", hw.getMsg());\n' +
        '               }\n' +
        '            }"\n' +
        '           ]\n' +
        '         }\n' +
        '      }',
      name: 'apiparamexample',
      sourceName: 'apiParamExample',
      content: '{json} Some json code:\n' +
        '      {\n' +
        '        "user": "Sample User",\n' +
        '         "payload": {\n' +
        '           "test": [\n' +
        '             "code": "\n' +
        '               public class HelloWorldTest {\n' +
        '                 HelloWorld hw = new HelloWorld();\n' +
        '                 @Test\n' +
        '                 public void testOkay {\n' +
        '                 assertEquals("HelloWorld", hw.getMsg());\n' +
        '               }\n' +
        '            }"\n' +
        '           ]\n' +
        '         }\n' +
        '      }'
      }
    ]
  }
];

const parser = new Parser(app);

describe('Parser: params detection', function () {

  testCases.forEach(testCase => {
    it(testCase.title, done => {
      const r = parser.findElements(testCase.testBlock);
      assert.deepEqual(r, testCase.expected);
      done();
    });
  });

});
