import { check } from "k6";
import { Options } from "k6/options";
import http from "k6/http";

const API_URL = `http://localhost:4000/api/v1`;

export let options: Options = {
  vus: 1000,
  duration: "1m",
};

const generateUsers = () => {
  const result: any = {};
  for (let vu = 1; vu <= (options.vus || 100); vu++) {
    result[vu] = {
      username: `username_${vu}`,
      password: `password_${vu}`,
      firstName: `firstName_${vu}`,
      lastName: `lastName_${vu}`,
      email: `test_${vu}@distritv.com`,
      m2mRelations: [
        {
          roleMappings: [
            {
              institutionId: 1,
              roleId: "7b5ec802-5923-4a1b-b9d1-2f522ad6c6a3",
            },
          ],
        },
      ],
    };
  }
  return result;
};

const USERS = generateUsers();

export function setup() {
  const res = http.post(
    `${API_URL}/auth/login`,
    {
      username: "admin",
      password: "4dm1nP4ss",
    },
    {
      headers: {
        "auth-type": "local",
      },
    }
  );
  check(res, {
    "status is 200": () => res.status === 200,
  });
  const token = `Bearer ${
    JSON.parse(res.body?.toString() || "{}").accessToken
  }`;
  Object.values(USERS).map((user) =>
    http.post(`${API_URL}/user`, JSON.stringify(user), {
      headers: {
        "auth-type": "local",
        authorization: token,
        "Content-Type": "application/json",
      },
    })
  );
}

export default function () {
  const res = http.post(
    `${API_URL}/auth/login`,
    { username: USERS[__VU].username, password: USERS[__VU].password },
    {
      headers: {
        "auth-type": "local",
      },
    }
  );
  check(res, {
    "status is 200": () => res.status === 200,
  });
  const token = `Bearer ${
    JSON.parse(res.body?.toString() || "{}").accessToken
  }`;
  const meRes = http.get(`${API_URL}/auth/me`, {
    headers: {
      "auth-type": "local",
      authorization: token,
    },
  });
  check(meRes, {
    "status is 200": () => res.status === 200,
  });
}

export function teardown() {
  // 4. teardown code
}
