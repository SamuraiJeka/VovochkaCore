import React, { useState } from "react";
import styles from "./MainPage.module.scss"
import LinkPage from "../../shared/Link/LinkPage";
const MainPage = () =>
{
    const get_random_anecdote = () => {
        const response = axios.get("localhost:5000/anecdote/random")
        return response.data
    }

    return(
        <div className={styles.main}>
            <input type="text"/>
            <div className={styles.anecdote}>
                <h1>Название</h1>
                <h4>fefef</h4>
            </div>
            <div>
                <button className={styles.random_button} onClick={() => get_random_anecdote()}>Рандомный анекдот</button>
            </div>
        </div>
    )
}

export default MainPage