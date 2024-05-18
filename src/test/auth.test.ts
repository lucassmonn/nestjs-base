import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "../app.module"
import { Connection } from "mongoose"
import { getConnectionToken } from "@nestjs/mongoose"

describe("Auth Flow", () => {
  let app: INestApplication
  let connection: Connection
  let access_token: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    connection = await app.get(getConnectionToken())
    await connection.db.dropDatabase()
  })

  it("Create user - /user (POST) - Success", async () => {
    const response = await request(app.getHttpServer())
      .post("/user")
      .send({ email: "test@test.com", password: "123" })
      .expect(201)

    expect(response.body).toEqual(
      expect.objectContaining({
        email: "test@test.com",
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    )

    expect(response.body.password).not.toBeDefined()

    const user = await connection
      .collection("users")
      .findOne({ email: "test@test.com" }, { projection: { password: 1 } })

    expect(user).toBeDefined()
    expect(user.password).not.toBe("123")
  })

  it("Get profile without token - /auth/profile (GET) - Unauthorized", async () => {
    await request(app.getHttpServer()).get("/auth/profile").expect(401)
  })

  it("Login - /auth/login (POST) - Success", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "test@test.com", password: "123" })
      .expect(200)

    access_token = response.body.access_token

    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    )
  })

  it("Get profile with token - /auth/profile (GET) - Success", async () => {
    const response = await request(app.getHttpServer())
      .get("/auth/profile")
      .set("Authorization", `Bearer ${access_token}`)
      .expect(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        email: "test@test.com",
        id: expect.any(String),
      }),
    )
  })

  afterAll(() => app.close())
})
