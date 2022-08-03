// src/users/usersController.ts
import {
    Body,
    Controller,
    Get,
    Middlewares,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
  } from "tsoa";
  import { Session, SessionBody } from "../Types/session";
  import { SessionService } from "../Services/session";
import bodyParser from "body-parser";
  
  @Route("session")
  @Middlewares(bodyParser.urlencoded({ extended: true }), bodyParser.json())
  export class SessionController extends Controller {
    @Get("all")
    public async getSessions(): Promise<Session[]> {
      return await new SessionService().getAll();
    }

    @Post()
    @SuccessResponse('201', 'Session Created')
    public async postSessions(@Body() body: SessionBody): Promise<void> {
      console.log(body);
      
      await new SessionService().create(body.sessions);
    }
}