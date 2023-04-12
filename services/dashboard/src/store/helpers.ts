export const insertNewAddedEntity = <T>(entityList: T[], newEntity: T) => {
  // TODO: If there is sort or search filters apply again after insert
  return [...entityList, newEntity]
}

export const refreshUpdatedEntity = <T extends { id: number | string }>(entityList: T[], newEntity: T) =>
  entityList.map(entity => entity.id === newEntity.id ? newEntity : entity)

export const removeDeletedEntity = <T extends { id: number | string }>(entityList: T[], deletedEntityId: number | string) => entityList.filter(entity => entity.id !== deletedEntityId)
