import React, { useState } from "react";
import AdminForm from "../components/AdminForm";
import CharacterList from "../components/CharacterList";
import styles from "../styles/Admin.module.css";

export default function Admin() {
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  function handleEdit(character) {
    setEditingCharacter(character);
  }

  function handleSaved() {
    setEditingCharacter(null);
    setRefreshFlag(!refreshFlag);
  }

  return (
    <div className={styles.container}>
      <h1>Panel de Administración</h1>
      <AdminForm characterToEdit={editingCharacter} onSaved={handleSaved} />
      <CharacterList key={refreshFlag} onEdit={handleEdit} allowDelete={true} />
    </div>
  );
}
