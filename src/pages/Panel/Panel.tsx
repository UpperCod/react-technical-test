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

function useMutateItems({
  request,
  set,
  get,
}: {
  request: (id: string, data: any) => any;
  get: (ids: string[]) => [string, any][];
  set: (data: any[]) => any;
}) {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    if (!list.length) return;
    /**
     * Regeneramos los items en funcion de los a actualizar.
     */
    const items = get(list);
    /**
     * Esperamos que todas las actualizaciones finalizen para así añádirlas
     * a los items observados.
     */
    Promise.all(items.map(([id, data]) => request(id, data))).then(
      (data: any[]) => set(data)
    );
    // Se resetea sabe para permitir nuevas actualizaciones.
    setList([]);
  }, [list]);

  return (id: string) => setList((list) => [...list, id]);
}

export function Panel(props: {
  template: Field[];
  endpoint: string;
  token: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [currentCreate, setCurrentCreate] = useState<Record>(defaultRecord);
  const [items, setItems] = useState<Record[]>([]);
  const [create, setCreate] = useState<Field[]>();

  const request = (method: string, body?: string, id?: string) =>
    fetch(props.endpoint + (id ? "/" + id : ""), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
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
  const addUpdate = useMutateItems({
    request: (id, data) => request("put", data, id),
    get: (ids) => {
      setItems((items) =>
        items.map((item) =>
          ids.includes(item.id) ? { ...item, loading: true } : item
        )
      );
      return items
        .filter(({ id }) => ids.includes(id))
        .map((item) => [item.id, JSON.stringify(fieldsToObject(item.fields))]);
    },
    set: (data) =>
      setItems((items) =>
        items.map((item) => {
          const nextItem = data.find(({ id }) => id === item.id);
          return nextItem ? objectToFields(nextItem, props.template) : item;
        })
      ),
  });

  // DELETE
  const addDelete = useMutateItems({
    request: (id) => request("delete", undefined, id),
    get: (ids) => {
      setItems((items) =>
        items.map((item) =>
          ids.includes(item.id) ? { ...item, loading: true } : item
        )
      );
      return items
        .filter(({ id }) => ids.includes(id))
        .map((item) => [item.id, JSON.stringify(fieldsToObject(item.fields))]);
    },
    set: (data) => {
      setItems((items) =>
        items.filter((item) => !data.find(({ id }) => id === item.id))
      );
    },
  });

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
                addUpdate(item.id);
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
              onRemove={() => {
                addDelete(item.id);
              }}
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
