import { useEffect, useRef, useState } from "react";
import "./Panel.css";
import { Item, Field } from "./Item";
import { Header } from "./Header";
import { useCustomProperties } from "../../hooks/useCustomProperties";

interface Record {
  id?: string;
  edit?: boolean;
  fields: Field[];
}

export function Panel(props: {
  template: Field[];
  endpoint: string;
  token: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [currentCreate, setCurrentCreate] = useState<Record>();
  const [items, setItems] = useState<Record[]>([]);
  const [create, setCreate] = useState<Record>();
  const [save, setSave] = useState([]);

  useCustomProperties(ref, {
    "Panel-item-columns": 3,
  });

  // GET
  useEffect(() => {
    let cancel: boolean;
    fetch("https://6230a3b1f113bfceed577e7f.mockapi.io/clients")
      .then((res) => res.json())
      .then((data: any[]) => {
        !cancel &&
          setItems(
            data.map<Record>((item) => ({
              id: item.id,
              fields: props.template.map((template) => ({
                ...template,
                value: item[template.name],
              })),
            }))
          );
      });
    () => (cancel = true);
  }, [props.endpoint]);

  //  POST
  useEffect(() => {
    if (!create) return;
    fetch("https://6230a3b1f113bfceed577e7f.mockapi.io/clients", {
      headers: {
        "content-type": "application/json",
        body: JSON.stringify(
          create.fields.reduce(
            (data, { name, value }) => ({
              ...data,
              [name]: value,
            }),
            {}
          )
        ),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
  }, [create]);

  return (
    <div ref={ref} className="Panel">
      <Header
        onCreate={() => {
          setCurrentCreate({
            fields: props.template,
          });
        }}
      ></Header>
      <div className="Panel-new-item">
        {currentCreate && (
          <Item
            fields={currentCreate.fields}
            onSave={(fields) => {
              setCreate({ fields });
            }}
            onRemove={() => {}}
            onChange={() => {}}
            edit
          ></Item>
        )}
      </div>
      <div className="Panel-items">
        <h2>Items</h2>
        {items.map((item) => (
          <div key={item.id}>
            <Item
              edit={item.edit}
              onSave={() => {}}
              onEdit={(fields) => {
                setItems(
                  items.map((_item) =>
                    item.id === _item.id
                      ? {
                          ..._item,
                          fields,
                          edit: !_item.edit,
                        }
                      : _item
                  )
                );
              }}
              onRemove={() => {}}
              onChange={(fields) => {
                setItems(
                  items.map((_item) =>
                    item.id === _item.id
                      ? {
                          ..._item,
                          fields,
                        }
                      : _item
                  )
                );
              }}
              fields={item.fields}
            ></Item>
          </div>
        ))}
      </div>
    </div>
  );
}
