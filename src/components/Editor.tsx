import { FC, useRef, useState, useEffect } from "react";
import { getIntrospectionQuery, IntrospectionQuery } from 'graphql';
import { Uri, editor, KeyMod, KeyCode, languages } from 'monaco-editor';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import * as JSONC from 'jsonc-parser';
import { debounce } from './debounce';
import "bootstrap/dist/css/bootstrap.min.css";

interface Props {
  options?: Options;
  value?: string[];
}

interface Options {
  readonly: boolean;
}

const fetcher = createGraphiQLFetcher({
  url: 'https://reefscan.com/graphql',
});


const defaultOperations =
  localStorage.getItem('operations') ??
  `
  # cmd/ctrl + return/enter will execute the op,
  # same in variables editor below
  # also available via context menu & f1 command palette
  
  query SampleQuery($limit: Int) {
    block(limit: $limit) {
      hash
      id
      parent_hash
  
    }
  }
  
`;

const defaultVariables =
  localStorage.getItem('variables') ??
  `
  {
    // limit will appear here as autocomplete,
    // and because the default value is 0, will
    // complete as such
    "limit": 5
}
`;

const getSchema = async () =>
  fetcher({
    query: getIntrospectionQuery(),
    operationName: 'IntrospectionQuery',
  });
const getOrCreateModel = (uri: string, value: string) => {
  return (
    editor.getModel(Uri.file(uri)) ??
    editor.createModel(value, uri.split('.').pop(), Uri.file(uri))
  );
};
const execOperation = async function () {
  console.log("Exec")
  const variables = editor.getModel(Uri.file('variables.json'))!.getValue();
  console.log("Exec1")

  const operations = editor.getModel(Uri.file('operation.graphql'))!.getValue();
  console.log("Exec2")

  const resultsModel = editor.getModel(Uri.file('results.json'));
  console.log("Exec3")

  const result = await fetcher({
    query: operations,
    variables: JSONC.parse(variables),
  });

  // TODO: this demo only supports a single iteration for http GET/POST,
  // no multipart or subscriptions yet.
  //@ts-expect-error
  const data = await result.next();
  console.log(data);

  resultsModel?.setValue(JSON.stringify(data.value, null, 2));
};

const queryAction = {
  id: "graphql-run",
  label: "Run Operation",
  contextMenuOrder: 0,
  contextMenuGroupId: "graphql",
  keybindings: [
    // eslint-disable-next-line no-bitwise
    KeyMod.CtrlCmd | KeyCode.Enter,
  ],
  run: execOperation,
};

// set these early on so that initial variables with comments don't flash an error
languages.json.jsonDefaults.setDiagnosticsOptions({
  allowComments: true,
  trailingCommas: 'ignore',
});


const createEditor = (
  ref: React.MutableRefObject<null>,
  options: editor.IStandaloneEditorConstructionOptions
) => editor.create(ref.current as unknown as HTMLElement, options);

export const Editor: FC<Props> = ({ options, value }) => {
  const opsRef = useRef(null);
  const varsRef = useRef(null);
  const resultsRef = useRef(null);
  const [queryEditor, setQueryEditor] =
    useState<editor.IStandaloneCodeEditor | null>(null);
  const [variablesEditor, setVariablesEditor] =
    useState<editor.IStandaloneCodeEditor | null>(null);
  const [resultsViewer, setResultsViewer] =
    useState<editor.IStandaloneCodeEditor | null>(null);
  const [schema, setSchema] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryModel = getOrCreateModel("operation.graphql", defaultOperations);
    const variablesModel = getOrCreateModel("variables.json", defaultVariables);
    const resultsModel = getOrCreateModel("results.json", "{}");

    queryEditor ??
      setQueryEditor(
        createEditor(opsRef, {
          theme: "vs-dark",
          model: queryModel,
          language: "graphql",
        })
      );
    variablesEditor ??
      setVariablesEditor(
        createEditor(varsRef, {
          theme: "vs-dark",
          model: variablesModel,
        })
      );
    resultsViewer ??
      setResultsViewer(
        createEditor(resultsRef, {
          theme: "vs-dark",
          model: resultsModel,
          readOnly: true,
          smoothScrolling: true,
        })
      );

    queryModel.onDidChangeContent(
      debounce(300, () => {
        localStorage.setItem("operations", queryModel.getValue());
      })
    );
    variablesModel.onDidChangeContent(
      debounce(300, () => {
        localStorage.setItem("variables", variablesModel.getValue());
      })
    );
    // only run once on mount
  }, []);

  useEffect(() => {
    queryEditor?.addAction(queryAction);
    variablesEditor?.addAction(queryAction);
  }, [variablesEditor, queryEditor]);
  /**
   * Handle the initial schema load
   */


  useEffect(() => {
    if (!schema && !loading) {
      setLoading(true);
      getSchema()
        .then((data) => {
          if (!('data' in data)) {
            throw Error(
              'this demo does not support subscriptions or http multipart yet'
            );
          }

          initializeMode({
            diagnosticSettings: {
              validateVariablesJSON: {
                [Uri.file('operation.graphql').toString()]: [
                  Uri.file('variables.json').toString(),
                ],
              },
              jsonDiagnosticSettings: {
                validate: true,
                schemaValidation: 'error',
                // set these again, because we are entirely re-setting them here
                allowComments: true,
                trailingCommas: 'ignore',
              }
            },
            schemas: [
              {
                introspectionJSON: data.data as unknown as IntrospectionQuery,
                uri: 'myschema.graphql',
              },
            ],
          });
          setSchema(data.data);
          return;

        })
        .then(() => setLoading(false));
    }
  }, [schema, loading])

  return (
    <div id="wrapper">
      <div id="left-pane" className="pane">
        <div ref={opsRef} className="editor" />
        <div ref={varsRef} className="editor" />
      </div>
      <div id="right-pane" className="pane">
        <div ref={resultsRef} className="editor" />
      </div>
    </div>
  );
};
