import type { IncomingMessage, ServerResponse } from "http";
import {
  authenticateToken,
  type AuthenticatedRequest,
} from "../middleware/authentication";
import {
    addCharacter,
    CharacterSchema,
  getAllCharacters,
  getCharacterById,
  HttpMethod,
  Role,
  type Character,
} from "../models";
import { authorizeRoles } from "../middleware/authorization";
import { message, safeParse } from "valibot";
import { parseBody } from "../utils/parseBody";

export const characterRouter = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const { method, url } = req;

  if (!(await authenticateToken(req as AuthenticatedRequest, res))) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Unauthorized" }));
    return;
  }

  if (url === "/characters" && method === HttpMethod.GET) {
    const characters = getAllCharacters();

    res.statusCode = 200;
    res.end(JSON.stringify(characters));
    return;
  }

  if (url === "/characters/" && method === HttpMethod.GET) {
    const id = parseInt(url.split("/").pop() as string, 10);
    const character = getCharacterById(id);

    if (!character) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Character not found" }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(character));
    return;
  }

  if (url === "/characters" && method === HttpMethod.POST) {
    if (
      !(await authorizeRoles(Role.ADMIN, Role.USER)(
        req as AuthenticatedRequest,
        res
      ))
    ) {
      res.statusCode = 403;
      res.end(JSON.stringify({ message: "Forbidden" }));
      return;
    }
    const body = await parseBody(req);
    const result = safeParse(CharacterSchema, body);
    if(result.issues){
        res.statusCode = 400;
        res.end(JSON.stringify({message: result.issues}))
        return;
    }

    const character: Character = body;
    addCharacter(character);

    res.statusCode = 201;
    res.end(JSON.stringify(character));
    return;

  }
};
