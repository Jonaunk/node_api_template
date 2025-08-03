import { minLength, object, pipe, string, type InferInput } from "valibot";

export const CharacterSchema = object({
    name: pipe(string(), minLength(6)),
    lastName: pipe(string(), minLength(6))
});



/**
 * Type representing a character, based on CharacterSchema and with a numeric id.
 */
export type Character = InferInput<typeof CharacterSchema> & {id: number};

/**
 * Stores characters in memory using a Map, where the key is the character's id.
 */
const characters: Map<number, Character> = new Map();

/**
 * Gets all stored characters.
 * @returns {Character[]} Array of characters.
 */
export const getAllCharacters = (): Character[] => {
    return Array.from(characters.values());
}

/**
 * Finds a character by its id.
 * @param {number} id - Character identifier.
 * @returns {Character | undefined} The character if found, undefined otherwise.
 */
export const getCharacterById = (id: number): Character | undefined => {
    return characters.get(id);
}

/**
 * Adds a new character to storage.
 * Generates a unique id based on the current date.
 * @param {Character} character - Data of the character to add.
 * @returns {Character} The added character with assigned id.
 */
export const addCharacter = (character: Character): Character => {
    if(character.id && !characters.has(character.id)){
        return character;
    }


    const newCharacter = {
        ...character, 
        id: new Date().getTime()
    }

    characters.set(newCharacter.id, newCharacter);

    return newCharacter;
}

/**
 * Updates the data of an existing character.
 * @param {number} id - Identifier of the character to update.
 * @param {Character} updatedCharacter - Updated character data.
 * @returns {Character | null} The updated character, or null if not found.
 */
export const updateCharacter = (id: number, updatedCharacter: Character): Character | null => {
    if(!characters.has(id)) {
        console.error(`Character with id ${id} not found`);
        return null;
    }

    characters.set(id, updatedCharacter);

    return updatedCharacter;

}

/**
 * Deletes a character by its id.
 * @param {number} id - Identifier of the character to delete.
 * @returns {boolean} true if deleted successfully, false if not found.
 */
export const deleteCharacter = (id: number): boolean => {
    if(!characters.has(id)){
        console.error(`Character with id ${id} not found`);
        return false;
    }

    characters.delete(id);
    return true;
}
