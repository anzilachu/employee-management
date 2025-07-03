import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API = 'http://localhost:8000/api/forms/forms/';

function makeField(id, overrides = {}) {
  return {
    id,
    label: '',
    field_type: 'text',
    order: 0,
    required: false,
    ...overrides,
  };
}

function SortableField({ id, field, onFieldChange, onRemove, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: isDragging ? '#e0e0e0' : '#f8f8f8',
        borderRadius: 6,
        padding: 12,
        marginBottom: 8,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
      }}
      {...attributes}
    >
      <span
        style={{ cursor: 'grab', fontWeight: 700, fontSize: 18 }}
        {...listeners}
      >
        ≡
      </span>
      <input name="label" placeholder="Label" value={field.label} onChange={e => onFieldChange(index, e)} style={{ flex: 2 }} />
      <select name="field_type" value={field.field_type} onChange={e => onFieldChange(index, e)} style={{ flex: 1 }}>
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="password">Password</option>
      </select>
      <label style={{ flex: 1 }}><input name="required" type="checkbox" checked={field.required} onChange={e => onFieldChange(index, e)} /> Required</label>
      <button type="button" onClick={() => onRemove(id)} style={{ flex: 0.5 }}>Remove</button>
    </div>
  );
}

export default function FormBuilderPage() {
  const nextId = useRef(1);
  const [forms, setForms] = useState([]);
  const [fields, setFields] = useState([makeField(0)]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => { fetchForms(); }, []);
  const fetchForms = async () => {
    const res = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
    setForms(res.data);
  };

  const addField = () => {
    setFields(fields => [...fields, makeField(nextId.current++)]);
  };
  const removeField = id => setFields(fields => fields.filter(f => f.id !== id));
  const handleField = (idx, e) => {
    setFields(fields => fields.map((f, i) =>
      i === idx ? { ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value } : f
    ));
  };

  // dnd-kit drag-and-drop
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex(f => f.id === active.id);
      const newIndex = fields.findIndex(f => f.id === over.id);
      setFields(fields => {
        const newFields = arrayMove(fields, oldIndex, newIndex).map((f, i) => ({ ...f, order: i }));
        return newFields;
      });
    }
  };

  const createForm = async e => {
    e.preventDefault();
    // Remove id before sending to backend
    const cleanFields = fields.map(({ id, ...rest }) => rest);
    try {
      await axios.post(API, { name, description: desc, fields: cleanFields }, { headers: { Authorization: `Bearer ${token}` } });
      setMsg('Form created');
      setName(''); setDesc(''); setFields([makeField(0)]); nextId.current = 1;
      fetchForms();
    } catch { setMsg('Failed to create form'); }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        padding: '40px 48px',
        margin: '0 auto 32px auto',
        minWidth: 400,
        maxWidth: 600,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h3 style={{ marginBottom: 24 }}>Create New Form</h3>
        <form onSubmit={createForm} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <input placeholder="Form Name" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} />
          <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} style={{ width: '100%' }} />
          <div style={{ width: '100%', marginBottom: 12 }}>Fields:</div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              {fields.map((f, i) => (
                <SortableField
                  key={f.id}
                  id={f.id}
                  index={i}
                  field={f}
                  onFieldChange={handleField}
                  onRemove={removeField}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'flex-end' }}>
            <button type="button" onClick={addField} style={{ minWidth: 120 }}>Add Field</button>
            <button type="submit" style={{ minWidth: 120 }}>Create Form</button>
          </div>
        </form>
        {msg && <div style={{ marginTop: 16 }}>{msg}</div>}
      </div>
      <h3>Existing Forms</h3>
      <ul>
        {forms.map(f => (
          <li key={f.id}><b>{f.name}</b> ({f.fields.length} fields)</li>
        ))}
      </ul>
    </div>
  );
} 