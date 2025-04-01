import React from "react";
import { Link } from "react-router-dom";
import styles from "./LinkPage.module.scss"

const LinkPage = ({children, path}) =>
{
    return(
        <Link to={path} className={styles.LinkPageContainer}>{children}</Link>
    )
}

export default LinkPage