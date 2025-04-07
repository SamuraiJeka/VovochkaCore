import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import styles from "./MainPage.module.scss";

const MainPage = () => {
  const [anecdote, setAnecdote] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getRandomAnecdote = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/anecdote/random");
      setAnecdote({
        name: response.data.name,
        content: response.data.content
      });
      setError("");
    } catch (error) {
      console.error("Ошибка при получении анекдота:", error);
      setError("Не удалось загрузить анекдот. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRandomAnecdote();
  }, []);

  return (
    <div className={styles.container}>
      {/* Навбар */}
      <nav className={styles.navbar}>
        <div className={styles.navMobile}>
          <button 
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          <Link to="/" className={styles.logo}>
            Анекдотник
          </Link>
        </div>

        <div className={`${styles.navContent} ${isMenuOpen ? styles.active : ""}`}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Поиск анекдотов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.navLinks}>
            <Link to="/rzhevsky" className={styles.navLink}>
              Ржевский
            </Link>
            <Link to="/jew" className={styles.navLink}>
              Евреи
            </Link>
          </div>
        </div>
      </nav>

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
    </div>
  );
};

export default MainPage;