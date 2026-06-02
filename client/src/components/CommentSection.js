import React, { useState, useEffect } from 'react';
import { commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const CommentSection = ({ articleId }) => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await commentsAPI.getByArticle(articleId);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addNotification('Ве молиме најавете се за да коментирате.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await commentsAPI.create({ article_id: articleId, content });
      addNotification(res.data.message || 'Коментарот е додаден.', 'success');
      setContent('');
    } catch (err) {
      addNotification(err.response?.data?.error || 'Грешка.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="comment-section">
      <h3 className="comment-section-title">Коментари ({comments.length})</h3>

      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            className="form-input form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Напишете коментар..."
            rows={3}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Испраќање...' : 'Испрати'}
          </button>
        </form>
      )}

      {!user && <p className="comment-login-prompt">Најавете се за да коментирате.</p>}

      <div className="comments-list">
        {loading ? (
          <p>Вчитување коментари...</p>
        ) : comments.length === 0 ? (
          <p className="no-comments">Сеуште нема коментари. Бидете први!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong className="comment-author">{comment.user_name}</strong>
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleDateString('mk-MK')}
                </span>
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
