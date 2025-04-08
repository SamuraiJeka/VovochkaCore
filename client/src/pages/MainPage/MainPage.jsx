import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMenu, FiX } from "react-icons/fi";
import styles from "./MainPage.module.scss";

const TAGS = {
  VOVOCHKA: "Про Вовочку",
  JEW: "Про евреев",
  CHURCH: "Про церковь",
  MOTHER_IN_LAW: "Про тёщу",
  ALCOHOL: "Про алкашей",
  ZOO: "Про зверей",
  RZEVSKY: "Про Ржевского",
  SHTIRLITS: "Про Штирлица",
  OTHERS: "Другое"
};


const MainPage = () => {
  const [anecdote, setAnecdote] = useState({});
  const [anecdotesList, setAnecdotesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mode, setMode] = useState("random");
  const [tag, setTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
    page: 0,
    hasMore: false
  });

  const controller = new AbortController();

  const getRandomAnecdote = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/anecdote/random", {
        signal: controller.signal
      })
      setAnecdote({
        name: response.data.name,
        content: response.data.content
      })
      setError("")
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Ошибка при получении анекдота:", error)
        setError("Не удалось загрузить анекдот. Попробуйте еще раз.")
      }
    } finally {
      setIsLoading(false)
    }
  };

  const getAnecdotesByTag = async () => {
    try {
      setIsLoading(true)
      setAnecdotesList([])
      
      const response = await axios.get("http://localhost:5000/anecdote/category", {
        params: {
          offset: pagination.offset,
          limit: pagination.limit,
          tag
        },
        signal: controller.signal
      });
      console.log(response.data)
      setAnecdotesList(response.data)
      setPagination(prev => ({
        ...prev,
        hasMore: response.data.length === prev.limit
      }));
      setError("");
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Ошибка при получении анекдотов:", error);
        setError("Не удалось загрузить анекдоты. Попробуйте обновить страницу.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "random") {
      getRandomAnecdote();
    } else {
      getAnecdotesByTag();
    }

    return () => controller.abort();
  }, [mode, tag, pagination.offset, pagination.limit]);

  const handleTagSelect = (selectedTag) => {
    setTag(selectedTag);
    setMode("list");
    setPagination({
      offset: 0,
      limit: 10,
      page: 0,
      hasMore: false
    });
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setTag(searchQuery.trim().toUpperCase());
      setMode("list");
      setPagination({
        offset: 0,
        limit: 10,
        page: 0,
        hasMore: false
      });
    }
  };

  const handleRandomClick = () => {
    setMode("random");
    setTag(null);
    setSearchQuery("");
    setAnecdotesList([]);
    getRandomAnecdote();
  };

  const handlePageChange = (newPage) => {
    if (newPage < 0 || (anecdotesList.length === 0 && newPage > pagination.page)) return;
    setPagination(prev => ({
      ...prev,
      page: newPage,
      offset: newPage * prev.limit
    }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination({
      offset: 0,
      limit: Number(newLimit),
      page: 0,
      hasMore: false
    });
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navMobile}>
          <button 
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className={styles.logo} onClick={handleRandomClick}>
            VovochkaCore
          </div>
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
            <button 
              className={styles.navLink}
              onClick={handleRandomClick}
            >
              Случайный
            </button>
            
            {Object.entries(TAGS).map(([key, value]) => (
              <button
                key={key}
                className={styles.navLink}
                onClick={() => handleTagSelect(key)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {mode === "random" ? (
        <main className={styles.mainContent}>
          {isLoading ? (
            <div className={styles.loader}>Загрузка...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div className={styles.anecdoteCard}>
              <h1 className={styles.title}>{anecdote.name}</h1>
              <p className={styles.content}>{anecdote.content}</p>
            </div>
          )}

          <button
            onClick={getRandomAnecdote}
            className={styles.randomButton}
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Новый анекдот'}
          </button>
        </main>
      ) : (
        <div className={styles.listContent}>
          <div className={styles.controls}>
            <div className={styles.pagination}>
              <button 
                onClick={() => handlePageChange(pagination.page - 1)} 
                disabled={pagination.page === 0 || isLoading || anecdotesList.length === 0}
              >
                Назад
              </button>
              
              <span>Страница {pagination.page + 1}</span>
              
              <button 
                onClick={() => handlePageChange(pagination.page + 1)} 
                disabled={!pagination.hasMore || isLoading || anecdotesList.length === 0}
              >
                Вперед
              </button>
            </div>

            <div className={styles.limitSelector}>
              <label>Показывать по:</label>
              <select
                value={pagination.limit}
                onChange={(e) => handleLimitChange(e.target.value)}
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
            ) : anecdotesList.length > 0 ? (
              anecdotesList.map((item) => (
                <div key={`${item.id}-${pagination.page}`} className={styles.anecdoteCard}>
                  <h3 className={styles.anecdoteTitle}>{item.name}</h3>
                  <p className={styles.anecdoteContent}>{item.content}</p>
                  <div className={styles.tags}>
                    <span className={styles.tag}>#{item.tag}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.empty}>Анекдотов не найдено</div>
            )}
          </div>
          <div className={styles.pagination} style={{marginTop: "20px"}}>
              <button 
                onClick={() => handlePageChange(pagination.page - 1)} 
                disabled={pagination.page === 0 || isLoading || anecdotesList.length === 0}
              >
                Назад
              </button>
              
              <span>Страница {pagination.page + 1}</span>
              
              <button 
                onClick={() => handlePageChange(pagination.page + 1)} 
                disabled={!pagination.hasMore || isLoading || anecdotesList.length === 0}
              >
                Вперед
              </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;