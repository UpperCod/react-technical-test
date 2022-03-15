import { useRef, useState } from "react";
import { Button, Input } from "../../components/components";
import { useCustomProperties } from "../../hooks/useCustomProperties";

export interface Field {
  type: string;
  name: string;
  value?: string;
}

const add = (value: any) => (value ? 1 : 0);

export function Item(props: {
  fields: Field[];
  edit?: boolean;
  loading?: boolean;
  onSave?: (fields: Field[]) => any;
  onEdit?: (fields: Field[]) => any;
  onRemove?: (fields: Field[]) => any;
  onChange: (fields: Field[]) => any;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useCustomProperties(ref, {
    "Panel-item-actions-columns":
      add(props.onSave) + add(props.onEdit && props.edit) + add(props.onChange),
  });

  return (
    <div className={`Panel-item ${props.loading ? "Panel-item--loading" : ""}`}>
      {props.fields.map((field) => (
        <Input
          {...field}
          disabled={props.loading || !props.edit}
          onChange={({ target }) => {
            props.onChange(
              props.fields.map((field) =>
                field.name === target.name
                  ? {
                      ...field,
                      value: target.value,
                    }
                  : field
              )
            );
          }}
        ></Input>
      ))}
      <div className="Panel-item-actions" ref={ref}>
        {props.onEdit && (
          <Button
            onClick={() => {
              props.onEdit && props.onEdit(props.fields);
            }}
          >
            ✏️
          </Button>
        )}
        {props.onSave && props.edit && (
          <Button
            onClick={() => {
              props.onSave && props.onSave(props.fields);
            }}
          >
            💾
          </Button>
        )}
        <Button
          onClick={() => {
            props.onRemove && props.onRemove(props.fields);
          }}
        >
          ❌
        </Button>
      </div>
    </div>
  );
}
