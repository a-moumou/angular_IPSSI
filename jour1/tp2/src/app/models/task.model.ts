/**
 * Modèle de données pour une tâche de la TodoList.
 * Définit la structure utilisée par le service et les composants.
 */
export interface Task {
  id: number;        // Identifiant unique (timestamp à la création)
  title: string;     // Libellé de la tâche
  done: boolean;     // Terminée ou non
  createdAt: Date;   // Date de création
}
