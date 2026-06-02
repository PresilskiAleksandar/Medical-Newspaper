import React, { useRef, useState } from 'react';
import { uploadAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const RichEditor = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { addNotification } = useNotification();

  const insertTag = (openTag, closeTag) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);
    const newText = before + openTag + selected + closeTag + after;
    onChange({ target: { name: 'content', value: newText } });
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 0);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.image(file);
      const imgTag = `<img src="http://localhost:5000${res.data.url}" alt="slika" style="max-width:100%;border-radius:12px;margin:16px 0;" />`;
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const before = value.substring(0, start);
      const after = value.substring(start);
      onChange({ target: { name: 'content', value: before + imgTag + after } });
      addNotification('Сликата е вметната!', 'success');
    } catch (err) {
      addNotification('Грешка при поставување слика.', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="rich-editor">
      <div className="editor-toolbar">
        <button type="button" className="toolbar-btn" onClick={() => insertTag('<b>', '</b>')} title="Болд">
          <b>B</b>
        </button>
        <button type="button" className="toolbar-btn" onClick={() => insertTag('<i>', '</i>')} title="Италик">
          <i>I</i>
        </button>
        <button type="button" className="toolbar-btn" onClick={() => insertTag('<h3>', '</h3>')} title="Наслов">
          H3
        </button>
        <button type="button" className="toolbar-btn" onClick={() => insertTag('<h4>', '</h4>')} title="Поднаслов">
          H4
        </button>
        <button type="button" className="toolbar-btn" onClick={() => insertTag('<p>', '</p>')} title="Параграф">
          &para;
        </button>
        <button type="button" className="toolbar-btn" onClick={() => insertTag('<ul><li>', '</li></ul>')} title="Листа">
          &bull;
        </button>
        <button type="button" className="toolbar-btn" onClick={() => insertTag('<blockquote>', '</blockquote>')} title="Цитат">
          &ldquo;
        </button>
        <label className="toolbar-btn image-upload-btn" title="Вметни слика">
          &#128247;
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        </label>
        {uploading && <span className="toolbar-status">Поставување слика...</span>}
      </div>
      <textarea
        ref={textareaRef}
        name="content"
        value={value}
        onChange={onChange}
        className="form-input form-textarea content-editor"
        rows={14}
        placeholder={placeholder}
        required
      />
      <div className="editor-preview-label">Преглед:</div>
      <div className="editor-preview" dangerouslySetInnerHTML={{ __html: value || '<span style="color:#94a3b8">Преглед на содржината...</span>' }} />
    </div>
  );
};

export default RichEditor;
