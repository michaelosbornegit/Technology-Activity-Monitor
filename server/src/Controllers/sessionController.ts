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
  import { ChromeSessionBody, Session, SessionBody } from "../Types/session";
  import { SessionService } from "../Services/session";
import bodyParser from "body-parser";
  
  @Route("session")
  @Middlewares(bodyParser.urlencoded({ extended: true }), bodyParser.json())
  export class SessionController extends Controller {
    @Get("all")
    public async getSessions(): Promise<Session[]> {
      return await new SessionService().getAll();
    }

    @Post("/desktop")
    @SuccessResponse('201', 'Session Created')
    public async postSessions(@Body() body: SessionBody) {
      await new SessionService().create(body.sessions);
    }

    @Post("/chrome")
    @SuccessResponse('201', 'Session Created')
    public async postChromeSession(@Body() body: ChromeSessionBody) {
      await new SessionService().createChromeSession(body);
    }
}