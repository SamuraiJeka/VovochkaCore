import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MainPage.module.scss"
import LinkPage from "../../shared/Link/LinkPage";
const MainPage = () =>
{
    const [anecdote, setAnecdote] = useState({});

    const get_random_anecdote = async () => {
        try {
            const response = await axios.get("http://localhost:5000/anecdote/random");
            setAnecdote({
                name: response.data.name,
                content: response.data.content
            });
        } catch (error) {
            console.error("Ошибка при получении анекдота:", error);
        }
    }

    useEffect(() => {
        get_random_anecdote();
    }, []);

    return(
        <div className={styles.main}>
            <input type="text"/>
            <div className={styles.anecdote}>
                <h1>{anecdote.name}</h1>
                <h3>{anecdote.content}</h3>
            </div>
            <div>
                <button className={styles.random_button} onClick={() => get_random_anecdote()}>Рандомный анекдот</button>
            </div>
        </div>
    )
}

export default MainPage