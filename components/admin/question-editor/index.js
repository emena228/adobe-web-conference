import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import slugify from "slugify";
import styles from "./index.module.scss";

// import {
//   getEncodedForm,
//   getFileName,
//   assetUrlToCloudfrontUrl,
// } from "@utils/js/functions";

const QuestionEditor = ({
  data = null,
  formSubmitFunc = () => {},
  fileChangeFunc = () => {},
  filePreviewFunc = () => {},
}) => {
  const [formData, setFormData] = useState(data || {});
  const updateField = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const updateResponse = (idx, value) => {
    let { responses = [] } = formData;
    responses[idx] = value;
    setFormData({ ...formData, responses: responses });
  };

  const deleteResponse = (idx) => {
    let { responses = [] } = formData;

    delete responses[idx];
    setFormData({
      ...formData,
      responses: responses.filter(() => {
        return true;
      }),
    });
  };

  const addField = () => {
    let { responses = [] } = formData;
    responses.push("");
    setFormData({ ...formData, responses: responses });
  };

  const { prompt, answerImage, responses = [], answer } = formData;

  return (
    <section className={styles.pollEditor}>
      <div className={styles.pollEditorInner}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formSubmitFunc(formData);
          }}
        >
          <div>
            <h1>{data ? "Edit" : "Create"} Question</h1>
          </div>

          <div className={styles.pollEditorField}>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="prompt"
                label="Prompt"
                variant="outlined"
                value={prompt}
                onChange={(e) => {
                  updateField("prompt", e.target.value);
                }}
              />
            </FormControl>
          </div>

          {responses &&
            responses.map((response, idx) => {
              return (
                <div className={styles.pollEditorField}>
                  <FormControl variant="filled" fullWidth>
                    <TextField
                      id="response"
                      label="Response"
                      variant="outlined"
                      value={response.value}
                      onChange={(e) => {
                        updateResponse(idx, {
                          value: e.target.value,
                          key: slugify(e.target.value).toLowerCase(),
                        });
                      }}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className={styles.pollEditorFieldDelete}
                    onClick={() => {
                      deleteResponse(idx);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              );
            })}

          <div className={styles.pollEditorFieldAddRemove}>
            <Button
              variant="contained"
              color="primary"
              className={styles.buttonPrimary}
              type="button"
              htmlType="button"
              onClick={addField}
              size="small"
            >
              Add Response
            </Button>
          </div>

          <div className={styles.pollEditorField}>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="answer"
                label="Answer"
                variant="outlined"
                value={answer.value}
                onChange={(e) => {
                  updateField("answer", {
                    value: e.target.value,
                    key: slugify(e.target.value).toLowerCase(),
                  });
                }}
              />
            </FormControl>
          </div>

          <div className={styles.pollEditorField}>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="image"
                label="Answer Image"
                variant="outlined"
                value={answerImage}
                onChange={(e) => {
                  updateField("answerImage", e.target.value);
                }}
              />
            </FormControl>
          </div>

          <div>
            <Button
              variant="contained"
              color="primary"
              className={styles.buttonPrimary}
              type="primary"
              htmlType="submit"
            >
              {data ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default QuestionEditor;
