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

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const MainPage = () => {
  const [anecdote, setAnecdote] = useState({})
  const [anecdotesList, setAnecdotesList] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mode, setMode] = useState("random")
  const [tag, setTag] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
    page: 0,
    hasMore: false
  })

  const controller = new AbortController();

  const getRandomAnecdote = async () => {
    try {
      setIsLoading(true);
      setAnecdotesList([])
      setSearchResults([])
      const response = await axios.get("http://localhost:5000/anecdote/random", {
        signal: controller.signal
      })
      setAnecdote(response.data)
      setError("")
    } catch (error) {
      handleError(error, "Не удалось загрузить анекдот. Попробуйте еще раз.");
    } finally {
      setIsLoading(false)
    }
  };

  const getSearchResults = async () => {
    try {
      setIsLoading(true);
      setAnecdotesList([])
      setAnecdote({})
      setSearchResults([])
      
      const response = await axios.get("http://localhost:5000/anecdote/page", {
        params: {
          offset: pagination.offset,
          limit: pagination.limit,
          search: searchQuery.trim()
        },
        signal: controller.signal
      })
      
      setSearchResults(response.data);
      setPagination(prev => ({
        ...prev,
        hasMore: response.data.length === prev.limit
      }));
      setError("")
    } catch (error) {
      handleError(error, "Не удалось выполнить поиск. Попробуйте еще раз.");
    } finally {
      setIsLoading(false)
    }
  };

  const getAnecdotesByTag = async () => {
    try {
      setIsLoading(true)
      setAnecdote({}); 
      setSearchResults([])
      setAnecdotesList([])
      
      const response = await axios.get("http://localhost:5000/anecdote/category", {
        params: {
          offset: pagination.offset,
          limit: pagination.limit,
          tag
        },
        signal: controller.signal
      });
      
      setAnecdotesList(response.data);
      setPagination(prev => ({
        ...prev,
        hasMore: response.data.length === prev.limit
      }));
      setError("");
    } catch (error) {
      handleError(error, "Не удалось загрузить анекдоты. Попробуйте обновить страницу.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error, message) => {
    if (!axios.isCancel(error)) {
      console.error("Ошибка:", error);
      setError(message);
    }
  };

  useEffect(() => {
    if (mode === "random") {
      if (searchQuery.trim()) {
        getSearchResults();
      } else {
        getRandomAnecdote();
      }
    } else if (mode === "list") {
      getAnecdotesByTag();
    }

    return () => controller.abort();
  }, [mode, tag, searchQuery, pagination.offset, pagination.limit]);

  useEffect(() => {
    // При изменении лимита сбрасываем пагинацию
    setPagination(prev => ({ ...prev, offset: 0, page: 0 }));
  }, [pagination.limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPagination(prev => ({ ...prev, offset: 0, page: 0 }));
      setMode("random");
    } else {
      setMode("random");
      getRandomAnecdote();
    }
  };

  const handleTagSelect = (selectedTag) => {
    setTag(selectedTag);
    setMode("list");
    setSearchQuery("");
    setPagination(prev => ({ ...prev, offset: 0, page: 0 }));
  };

  const handleRandomClick = () => {
    setMode("random");
    setTag(null);
    setSearchQuery("");
    setPagination(prev => ({ ...prev, offset: 0, page: 0 }));
    getRandomAnecdote();
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPagination(prev => ({ ...prev, limit: newSize }));
  };

  const renderAnecdotes = (items) => (
    <div className={styles.anecdotesList}>
      {items.map((item) => (
        <div key={item.id} className={styles.anecdoteCard}>
          <h3>{item.name}</h3>
          <p>{item.content}</p>
          {item.tag && <div className={styles.tag}>#{item.tag}</div>}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navMobile}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          <div onClick={handleRandomClick}>VovochkaCore</div>
        </div>

        <div className={`${styles.navContent} ${isMenuOpen ? styles.active : ""}`}>
          {mode === "random" && (
            <form onSubmit={handleSearch} className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Поиск по содержанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          )}

          <div className={styles.navLinks}>
            <button onClick={handleRandomClick}>Случайный</button>
            {Object.entries(TAGS).map(([key, value]) => (
              <button key={key} onClick={() => handleTagSelect(key)}>
                {value}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className={styles.mainContent}>
        {isLoading && <div className={styles.loader}>Загрузка...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {mode === "random" ? (
          <>
            {searchQuery.trim() ? (
              <>
                <h2>Результаты поиска: "{searchQuery}"</h2>
                {searchResults.length > 0 ? (
                  renderAnecdotes(searchResults)
                ) : (
                  !isLoading && <div className={styles.noResults}>Ничего не найдено</div>
                )}
              </>
            ) : (
              <div className={styles.randomAnecdote}>
                <h1>{anecdote.name}</h1>
                <p>{anecdote.content}</p>
                <button onClick={getRandomAnecdote} disabled={isLoading}>
                  Новый анекдот
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <h2>{TAGS[tag]}</h2>
            {renderAnecdotes(anecdotesList)}
          </>
        )}
        
        {(searchResults.length > 0 || anecdotesList.length > 0) && (
          <div className={styles.paginationControls}>
            
            
            <div className={styles.pagination}>
              <div className={styles.pageSizeSelector}>
                <label>Элементов на странице:</label>
                <select 
                  value={pagination.limit}
                  onChange={handlePageSizeChange}
                  disabled={isLoading}
                >
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => setPagination(prev => ({ 
                  ...prev, 
                  offset: (prev.page - 1) * prev.limit,
                  page: prev.page - 1 
                }))}
                disabled={pagination.page === 0}
              >
                Назад
              </button>
              <span>Страница {pagination.page + 1}</span>
              <button
                onClick={() => setPagination(prev => ({ 
                  ...prev, 
                  offset: (prev.page + 1) * prev.limit,
                  page: prev.page + 1 
                }))}
                disabled={!pagination.hasMore}
              >
                Вперед
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainPage