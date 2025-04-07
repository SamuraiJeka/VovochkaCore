import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./JewPage.module.scss";
import { Link } from "react-router-dom";
import { FiX, FiMenu } from "react-icons/fi";

const JewPage = () => {
  const [pageCount, setPageCount] = useState(0);
  const [anecdotes, setAnecdotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [tag, setTag] = useState("JEW");

  const getRzhevskyAnecdote = async () => {
    try {
      setIsLoading(true);
      setAnecdotes([]);
      
      const response = await axios.get("http://localhost:5000/anecdote/category", {
        params: {
          offset,
          limit,
          tag: tag || undefined
        }
      });
      
      setAnecdotes(response.data);

      const hasMoreData = response.data.length >= limit;
      setHasMore(hasMoreData);

      if (response.data.length === 0 && offset > 0) {
        setOffset(0);
        setPageCount(0);
      }
      
      setError("");
    } catch (error) {
      console.error("Ошибка при получении анекдотов:", error);
      setError("Не удалось загрузить анекдоты. Попробуйте обновить страницу.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRzhevskyAnecdote();
  }, [offset, limit, tag]);

  const handleSearch = (e) => {
    e.preventDefault();
    setTag(searchQuery);
    setOffset(0);
    setPageCount(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 0) return;
    setPageCount(newPage);
    setOffset(newPage * limit);
  };

  const canGoNext = hasMore && anecdotes.length === limit;

  return(
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navMobile}>
          <button 
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div className={`${styles.navContent} ${isMenuOpen ? styles.active : ""}`}>
          <form className={styles.searchContainer} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Поиск анекдотов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </form>

          <div className={styles.navLinks}>
            <Link to="/rzhevsky" className={styles.navLink}>
                Ржевский
            </Link>
            <Link to="/" className={styles.navLink}>
                Главная страница
            </Link>
          </div>
        </div>
      </nav>

      <div className={styles.controls}>
        <div className={styles.pagination}>
          <button 
            onClick={() => handlePageChange(pageCount - 1)} 
            disabled={pageCount === 0 || isLoading}
          >
            Назад
          </button>
          
          <span>Страница {pageCount + 1}</span>
          
          <button 
            onClick={() => handlePageChange(pageCount + 1)} 
            disabled={!canGoNext || isLoading}
          >
            Вперед
          </button>
        </div>

        <div className={styles.limitSelector}>
          <label>Показывать по:</label>
          <select
            value={limit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              setLimit(newLimit);
              setOffset(0);
              setPageCount(0);
            }}
            disabled={isLoading}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.anecdotesList}>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        ) : anecdotes.length > 0 ? (
          anecdotes.map((anecdote) => (
            <div key={`${anecdote.id}-${offset}`} className={styles.anecdoteCard}>
              <h3 className={styles.anecdoteTitle}>{anecdote.name}</h3>
              <p className={styles.anecdoteContent}>{anecdote.content}</p>
              <div className={styles.tags}>
                <span className={styles.tag}>#{anecdote.tag}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>Анекдотов не найдено</div>
        )}
      </div>
    </div>
  );
};

export default JewPage;