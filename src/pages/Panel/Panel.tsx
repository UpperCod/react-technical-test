import { useEffect, useRef, useState } from "react";
import "./Panel.css";
import { Item, Field } from "./Item";
import { Header } from "./Header";
import { useCustomProperties } from "../../hooks/useCustomProperties";

interface Record {
  id: string;
  edit?: boolean;
  loading?: boolean;
  fields: Field[];
}

/**
 *  Transforma un objeto tipo Field a un objeto normal
 */
const fieldsToObject = (fields: Field[]) =>
  fields.reduce(
    (data, { name, value }) => ({
      ...data,
      [name]: value,
    }),
    {}
  );

/**
 * Transforma un objeto a un record
 */
const objectToFields = (item: any, template: Field[]): Record => ({
  id: item.id,
  fields: template.map((template) => ({
    ...template,
    value: item[template.name],
  })),
});

/**
 * Crea un record vacio
 */
const defaultRecord = (): Record => ({ id: "", fields: [] });

export function Panel(props: {
  template: Field[];
  endpoint: string;
  token: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [currentCreate, setCurrentCreate] = useState<Record>(defaultRecord);
  const [items, setItems] = useState<Record[]>([]);
  const [create, setCreate] = useState<Field[]>();
  const [save, setSave] = useState<string[]>([]);

  const request = (method: string, body?: string, id?: string) =>
    fetch(props.endpoint + (id ? "/" + id : ""), {
      headers: {
        "Content-Type": "application/json",
      },
      method,
      body,
    }).then((res) => res.json());

  useCustomProperties(ref, {
    "Panel-item-columns": 3,
  });

  // GET
  useEffect(() => {
    let cancel: boolean;

    request("get").then(
      (data: any[]) =>
        !cancel &&
        setItems(
          data
            .map<Record>((data) => objectToFields(data, props.template))
            .reverse()
        )
    );

    return () => {
      cancel = true;
    };
  }, [props.endpoint]);

  //  POST
  useEffect(() => {
    if (!create) return;

    setCurrentCreate({
      ...currentCreate,
      loading: true,
    });

    request("post", JSON.stringify(fieldsToObject(create))).then((data) => {
      // Añáde el item creado en el servidor a la lista items.
      setItems((items) => [objectToFields(data, props.template), ...items]);
      // Resetea currentCreate
      setCurrentCreate(defaultRecord);
    });
  }, [create]);

  // PUT
  useEffect(() => {
    if (!save.length) return;

    /**
     * Con este proceso busco afectar solo los items asociados a save,
     * para asi permitir actualizaciones multiples.
     */
    const [snapshotItems, serverItems] = items.reduce<[Record[], any[]]>(
      ([items, serverItems], item) =>
        save.includes(item.id)
          ? [
              [
                ...items,
                {
                  ...item,
                  loading: true,
                },
              ],
              [...serverItems, [item.id, fieldsToObject(item.fields)]],
            ]
          : [items, serverItems],
      [[], []]
    );
    /**
     * Regeneramos los items en funcion de los a actualizar.
     */
    setItems((items) =>
      items.map(
        (item) => snapshotItems.find(({ id }) => id === item.id) || item
      )
    );

    /**
     * Esperamos que todas las actualizaciones finalizen para si añádirlas
     * a los items observados.
     */
    Promise.all(
      serverItems.map(([id, data]) => request("put", JSON.stringify(data), id))
    ).then((data: any[]) => {
      setItems((items) =>
        items.map((item) => {
          const nextItem = data.find(({ id }) => id === item.id);
          return nextItem ? objectToFields(nextItem, props.template) : item;
        })
      );
    });

    // Se resetea sabe para permitir nuevas actualizaciones.
    setSave([]);
  }, [save]);

  return (
    <div ref={ref} className="Panel">
      <Header
        onCreate={() => {
          setCurrentCreate({
            id: "",
            fields: props.template,
          });
        }}
      ></Header>
      <div className="Panel-new-item">
        {!!currentCreate.fields.length && (
          <Item
            edit
            loading={currentCreate.loading}
            fields={currentCreate.fields}
            onSave={(fields) => {
              setCreate(fields);
            }}
            onRemove={() => {}}
            onChange={(fields) => {
              setCurrentCreate({
                ...currentCreate,
                fields,
              });
            }}
          ></Item>
        )}
      </div>
      <div className="Panel-items">
        <h2>Items</h2>
        {items.map((item) => (
          <div key={item.id}>
            <Item
              edit={item.edit}
              loading={item.loading}
              onSave={() => {
                setSave([...save, item.id]);
              }}
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
