import React from "react";
import CharacterList from "../components/CharacterList";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Lista de NPC</h1>
      <CharacterList />
    </div>
  );
}
