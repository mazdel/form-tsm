"use client";
import PropTypes from "prop-types";
import { Form, InputText, Button, ValidationInfo } from "@/components/Form";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faFloppyDisk,
  faCheckDouble,
  faAngleLeft,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { ButtonSidemenu } from "@/components/ButtonSidemenu";
import { Sidemenu } from "@/components/Sidemenu";
import { useFetch } from "@/hooks/useFetch";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

const EditMachine = ({ anchor, onClose }) => {
  const [fields, setFields] = useState(null);
  const [fieldsResponse] = useFetch(`/api/v1/machines/${anchor}`, {
    method: "GET",
  });
  const [missingContent, setMissingContent] = useState(null);

  useEffect(() => {
    let content = (
      <div
        className="
      flex w-full items-center justify-center overflow-clip rounded-lg bg-white 
      md:w-2/3 xl:w-1/3
      dark:bg-gradient-to-br dark:from-fuchsia-800 dark:to-violet-800
    "
      >
        <FontAwesomeIcon icon={faCircleNotch} className="h-36" spin />
      </div>
    );

    if (fieldsResponse.status == "error" && fieldsResponse.code > 200) {
      content = (
        <div
          className="
            flex w-full items-center justify-center gap-2 overflow-clip rounded-lg bg-white font-bold 
            md:w-2/3 xl:w-1/3
            dark:bg-gradient-to-br dark:from-fuchsia-800 dark:to-violet-800
          "
        >
          <FontAwesomeIcon icon={faCircleXmark} className="h-20" /> -{" "}
          {fieldsResponse.code}
        </div>
      );
    }
    setMissingContent(content);
  }, [fieldsResponse, fields]);

  useEffect(() => {
    if (fieldsResponse.code === 200) {
      setFields(fieldsResponse.data.result);
    }
    return () => {
      setFields(null);
    };
  }, [fieldsResponse]);

  return (
    <div className="flex min-h-svh w-full flex-col">
      <header className="flex flex-row items-center justify-between p-2">
        <Link
          href={`/machines`}
          className="flex flex-initial justify-center rounded-lg p-3 text-base hover:bg-violet-200 dark:hover:bg-purple-800"
          onClick={(e) => {
            if (onClose) {
              return onClose(e);
            }
          }}
        >
          <FontAwesomeIcon icon={faAngleLeft} className="h-5" />
        </Link>
        <ButtonSidemenu className="flex flex-initial justify-center rounded-lg p-3 text-base hover:bg-violet-200 dark:hover:bg-purple-800">
          <FontAwesomeIcon icon={faCogs} className="h-5" />
        </ButtonSidemenu>
      </header>
      <Sidemenu />

      <section className="flex flex-auto justify-center p-2">
        {fields ? (
          <Form
            action={`/api/v1/machines/${anchor}`}
            id={anchor}
            method="PATCH"
            className="
                flex w-full flex-col justify-between overflow-hidden rounded-lg bg-white p-3 shadow-sm 
                md:w-2/3 xl:w-1/3
                dark:bg-gradient-to-br dark:from-fuchsia-800 dark:to-violet-800
              "
            defaultFieldsValue={fields.inputState}
          >
            <div className="flex flex-auto flex-col">
              {Object.entries(fields.fields)
                .sort(([akey], [bkey]) => {
                  return akey.split("_")[1] - bkey.split("_")[1];
                })
                .map(([key, field], idx) => {
                  let { value, spec, name, ...rest } = field;

                  if (typeof value == "number") {
                    value = value.toLocaleString("id-ID");
                  }

                  let childElement = (
                    <div className="mb-2 flex w-full flex-row  justify-between">
                      <div className="">{name}</div>
                      <div className="px-1 text-end font-semibold">{value}</div>
                    </div>
                  );

                  if (key == "rowId") {
                    return <InputText key={idx} type="hidden" name={name} />;
                  }
                  if (spec === "heading") {
                    let textSize = "text-lg";
                    switch (field.type) {
                      case "h1":
                        textSize = "text-3xl";
                        break;
                      case "h2":
                        textSize = "text-2xl";
                        break;
                      case "h3":
                        textSize = "text-xl";
                        break;
                    }
                    childElement = (
                      <div className="mb-0 flex w-full flex-row justify-center">
                        <div
                          className={`px-1 text-center font-bold ${textSize}`}
                        >
                          {value}
                        </div>
                      </div>
                    );
                  }

                  if (spec === "input") {
                    value = undefined;
                    const [column] = key.split("_");
                    childElement = (
                      <div className="mb-2 flex w-full flex-col justify-between">
                        <div className="">{name}</div>
                        <InputText
                          defaultValue={value}
                          className="
                          overflow-hidden border-b border-violet-200 bg-transparent px-1 py-1 text-end outline-none 
                          transition-all duration-150 focus:text-lg dark:border-violet-100
                        "
                          name={`${column}`}
                          {...rest}
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className="m-1">
                      {childElement}
                    </div>
                  );
                })}
            </div>
            <div>
              <ValidationInfo
                field="_all"
                className="justify-center p-2 text-center text-sm"
                classError="text-red-500"
                classSuccess="text-green-500"
              />
            </div>
            <Button
              type="submit"
              form={anchor}
              className="
                  flex h-14 flex-initial items-center justify-center
                  gap-2 rounded-full bg-violet-900 p-3 text-lg font-bold
                  text-white active:bg-gradient-to-br active:from-violet-900
                  active:to-fuchsia-500 dark:bg-violet-50
                  dark:text-violet-900 dark:active:bg-gradient-to-br dark:active:from-violet-50 dark:active:to-fuchsia-200
                "
              onOkChildren={
                <FontAwesomeIcon icon={faCheckDouble} className="h-4" />
              }
            >
              <span>SAVE</span>
              <FontAwesomeIcon icon={faFloppyDisk} className="h-4" />
            </Button>
          </Form>
        ) : (
          missingContent
        )}
      </section>
      <Footer />
    </div>
  );
};
EditMachine.propTypes = {
  anchor: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};
export default EditMachine;
