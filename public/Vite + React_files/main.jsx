import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=f1802b7d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=f1802b7d"; const StrictMode = __vite__cjsImport1_react["StrictMode"];
import __vite__cjsImport2_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=f1802b7d"; const createRoot = __vite__cjsImport2_reactDom_client["createRoot"];
import "/src/index.css?t=1751769538582";
import { createBrowserRouter, RouterProvider } from "/node_modules/.vite/deps/react-router-dom.js?v=f1802b7d";
import HomePage from "/src/pages/HomePage.jsx?t=1751769538582";
import RootLayout from "/src/RootLayout.jsx";
import AuthLayout from "/src/pages/auth/AuthLayout.jsx?t=1751769538582";
import LoginPage from "/src/pages/auth/LoginPage.jsx";
import { ThemeProvider } from "/node_modules/.vite/deps/@emotion_react.js?v=f1802b7d";
import theme from "/src/configs/MUIConfig.js";
import { Provider } from "/node_modules/.vite/deps/react-redux.js?v=f1802b7d";
import { persistor, store } from "/src/redux/store.js";
import { PersistGate } from "/node_modules/.vite/deps/redux-persist_integration_react.js?v=f1802b7d";
import DetailMoviePage from "/src/pages/DetailMoviePage.jsx?t=1751769538582";
import MoviePage from "/src/pages/MoviePage.jsx?t=1751769538582";
import ChooseSeatPage from "/src/pages/protected_route/ChooseSeatsPage.jsx?t=1751769538582";
import ProtectedRoute from "/src/pages/protected_route/ProtectedRoute.jsx";
import AdminRoute from "/src/pages/admin/AdminRoute.jsx";
import DashBoardPage from "/src/pages/admin/DashBoardPage.jsx";
import StatisticalPage from "/src/pages/admin/StatisticalPage.jsx";
import TheaterSystemPage from "/src/pages/admin/TheaterSystemPage.jsx";
import CinemaTheater from "/src/components/admin/cinema_theater/CinemaTheater.jsx";
import SeatMap from "/src/components/admin/seat/SeatMap.jsx";
import GoogleCallback from "/src/pages/auth/GoogleCallback.jsx";
const router = createBrowserRouter(
  [
    {
      element: /* @__PURE__ */ jsxDEV(RootLayout, {}, void 0, false, {
        fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
        lineNumber: 28,
        columnNumber: 12
      }, this),
      children: [
        {
          path: "/",
          element: /* @__PURE__ */ jsxDEV(HomePage, {}, void 0, false, {
            fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
            lineNumber: 32,
            columnNumber: 14
          }, this)
        },
        {
          path: "/detail-movie/:id",
          element: /* @__PURE__ */ jsxDEV(DetailMoviePage, {}, void 0, false, {
            fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
            lineNumber: 36,
            columnNumber: 14
          }, this)
        },
        {
          path: "/movie",
          element: /* @__PURE__ */ jsxDEV(MoviePage, {}, void 0, false, {
            fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
            lineNumber: 40,
            columnNumber: 14
          }, this)
        },
        {
          element: /* @__PURE__ */ jsxDEV(ProtectedRoute, {}, void 0, false, {
            fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
            lineNumber: 43,
            columnNumber: 14
          }, this),
          children: [
            {
              path: "/choose-seat",
              element: /* @__PURE__ */ jsxDEV(ChooseSeatPage, {}, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 47,
                columnNumber: 16
              }, this)
            }
          ]
        },
        {
          element: /* @__PURE__ */ jsxDEV(AuthLayout, {}, void 0, false, {
            fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
            lineNumber: 52,
            columnNumber: 14
          }, this),
          path: "/auth",
          children: [
            {
              index: true,
              path: "login",
              element: /* @__PURE__ */ jsxDEV(LoginPage, {}, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 58,
                columnNumber: 16
              }, this)
            },
            {
              path: "google/callback",
              element: /* @__PURE__ */ jsxDEV(GoogleCallback, {}, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 62,
                columnNumber: 16
              }, this)
            }
          ]
        },
        {
          element: /* @__PURE__ */ jsxDEV(AdminRoute, {}, void 0, false, {
            fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
            lineNumber: 68,
            columnNumber: 14
          }, this),
          path: "/admin",
          children: [
            {
              index: true,
              path: "dashboard",
              element: /* @__PURE__ */ jsxDEV(DashBoardPage, {}, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 74,
                columnNumber: 16
              }, this)
            },
            {
              path: "thong-ke",
              element: /* @__PURE__ */ jsxDEV(StatisticalPage, {}, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 78,
                columnNumber: 16
              }, this)
            },
            {
              path: "he-thong-rap",
              element: /* @__PURE__ */ jsxDEV(TheaterSystemPage, {}, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 82,
                columnNumber: 16
              }, this)
            },
            {
              path: "chi-nhanh",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Chi nhanh" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 86,
                columnNumber: 16
              }, this)
            },
            {
              path: "rap",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý rạp" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 90,
                columnNumber: 16
              }, this)
            },
            {
              path: "so-do-ghe",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý sơ đồ ghế" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 94,
                columnNumber: 16
              }, this)
            },
            {
              path: "so-do-ghe/:id",
              element: /* @__PURE__ */ jsxDEV(SeatMap, {}, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 98,
                columnNumber: 16
              }, this)
            },
            {
              path: "phong-chieu",
              element: /* @__PURE__ */ jsxDEV(CinemaTheater, {}, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 102,
                columnNumber: 16
              }, this)
            },
            {
              path: "the-thanh-vien",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý thẻ thành viên" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 106,
                columnNumber: 16
              }, this)
            },
            {
              path: "xuat-chieu",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý xuất chiếu" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 110,
                columnNumber: 16
              }, this)
            },
            {
              path: "phim",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý phim" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 114,
                columnNumber: 16
              }, this)
            },
            {
              path: "hoa-don",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý hóa đơn" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 118,
                columnNumber: 16
              }, this)
            },
            {
              path: "do-an",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý đồ ăn" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 122,
                columnNumber: 16
              }, this)
            },
            {
              path: "combo",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý combo" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 126,
                columnNumber: 16
              }, this)
            },
            {
              path: "ma-giam-gia",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý mã giảm giá" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 130,
                columnNumber: 16
              }, this)
            },
            {
              path: "gia-ve",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý giá vé" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 134,
                columnNumber: 16
              }, this)
            },
            {
              path: "nguoi-dung",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý người dùng" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 139,
                columnNumber: 16
              }, this)
            },
            {
              path: "vai-tro",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý vai trò" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 143,
                columnNumber: 16
              }, this)
            },
            {
              path: "quyen-han",
              element: /* @__PURE__ */ jsxDEV("p", { children: "Quản lý quyền hạn" }, void 0, false, {
                fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
                lineNumber: 147,
                columnNumber: 16
              }, this)
            }
          ]
        }
      ]
    }
  ]
);
createRoot(document.getElementById("root")).render(
  // <StrictMode>
  /* @__PURE__ */ jsxDEV(Provider, { store, children: /* @__PURE__ */ jsxDEV(PersistGate, { loading: /* @__PURE__ */ jsxDEV("p", { children: "Loading ..." }, void 0, false, {
    fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
    lineNumber: 157,
    columnNumber: 27
  }, this), persistor, children: /* @__PURE__ */ jsxDEV(ThemeProvider, { theme, children: /* @__PURE__ */ jsxDEV(RouterProvider, { router }, void 0, false, {
    fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
    lineNumber: 159,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
    lineNumber: 158,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
    lineNumber: 157,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "D:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx",
    lineNumber: 156,
    columnNumber: 3
  }, this)
  //{/* </StrictMode> */}
);

//# sourceMappingURL=data:application/json;base64,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O0FBQUE7QUFBQSxTQUlBLEtBTEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQU1BO0FBQUE7QUFFRiIsIm5hbWVzIjpbIlN0cmljdE1vZGUiLCJjcmVhdGVSb290IiwiY3JlYXRlQnJvd3NlclJvdXRlciIsIlJvdXRlclByb3ZpZGVyIiwiSG9tZVBhZ2UiLCJSb290TGF5b3V0IiwiQXV0aExheW91dCIsIkxvZ2luUGFnZSIsIlRoZW1lUHJvdmlkZXIiLCJ0aGVtZSIsIlByb3ZpZGVyIiwicGVyc2lzdG9yIiwic3RvcmUiLCJQZXJzaXN0R2F0ZSIsIkRldGFpbE1vdmllUGFnZSIsIk1vdmllUGFnZSIsIkNob29zZVNlYXRQYWdlIiwiUHJvdGVjdGVkUm91dGUiLCJBZG1pblJvdXRlIiwiRGFzaEJvYXJkUGFnZSIsIlN0YXRpc3RpY2FsUGFnZSIsIlRoZWF0ZXJTeXN0ZW1QYWdlIiwiQ2luZW1hVGhlYXRlciIsIlNlYXRNYXAiLCJHb29nbGVDYWxsYmFjayIsInJvdXRlciIsImVsZW1lbnQiLCJjaGlsZHJlbiIsInBhdGgiLCJpbmRleCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsibWFpbi5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RyaWN0TW9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNyZWF0ZVJvb3QgfSBmcm9tICdyZWFjdC1kb20vY2xpZW50JztcbmltcG9ydCAnLi9pbmRleC5jc3MnO1xuaW1wb3J0IHsgY3JlYXRlQnJvd3NlclJvdXRlciwgUm91dGVyUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCBIb21lUGFnZSBmcm9tICdAcGFnZXMvSG9tZVBhZ2UnO1xuaW1wb3J0IFJvb3RMYXlvdXQgZnJvbSAnLi9Sb290TGF5b3V0JztcbmltcG9ydCBBdXRoTGF5b3V0IGZyb20gJ0BwYWdlcy9hdXRoL0F1dGhMYXlvdXQnO1xuaW1wb3J0IExvZ2luUGFnZSBmcm9tICdAcGFnZXMvYXV0aC9Mb2dpblBhZ2UnO1xuaW1wb3J0IHsgVGhlbWVQcm92aWRlciB9IGZyb20gJ0BlbW90aW9uL3JlYWN0JztcbmltcG9ydCB0aGVtZSBmcm9tICdAY29uZmlncy9NVUlDb25maWcnO1xuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBwZXJzaXN0b3IsIHN0b3JlIH0gZnJvbSAnQHJlZHV4L3N0b3JlJztcbmltcG9ydCB7IFBlcnNpc3RHYXRlIH0gZnJvbSAncmVkdXgtcGVyc2lzdC9pbnRlZ3JhdGlvbi9yZWFjdCc7XG5pbXBvcnQgRGV0YWlsTW92aWVQYWdlIGZyb20gJ0BwYWdlcy9EZXRhaWxNb3ZpZVBhZ2UnO1xuaW1wb3J0IE1vdmllUGFnZSBmcm9tICdAcGFnZXMvTW92aWVQYWdlJztcbmltcG9ydCBDaG9vc2VTZWF0UGFnZSBmcm9tICdAcGFnZXMvcHJvdGVjdGVkX3JvdXRlL0Nob29zZVNlYXRzUGFnZS5qc3gnO1xuaW1wb3J0IFByb3RlY3RlZFJvdXRlIGZyb20gJ0BwYWdlcy9wcm90ZWN0ZWRfcm91dGUvUHJvdGVjdGVkUm91dGUuanN4JztcbmltcG9ydCBBZG1pblJvdXRlIGZyb20gJ0BwYWdlcy9hZG1pbi9BZG1pblJvdXRlLmpzeCc7XG5pbXBvcnQgRGFzaEJvYXJkUGFnZSBmcm9tICdAcGFnZXMvYWRtaW4vRGFzaEJvYXJkUGFnZS5qc3gnO1xuaW1wb3J0IFN0YXRpc3RpY2FsUGFnZSBmcm9tICdAcGFnZXMvYWRtaW4vU3RhdGlzdGljYWxQYWdlLmpzeCc7XG5pbXBvcnQgVGhlYXRlclN5c3RlbVBhZ2UgZnJvbSAnQHBhZ2VzL2FkbWluL1RoZWF0ZXJTeXN0ZW1QYWdlLmpzeCc7XG5pbXBvcnQgQ2luZW1hVGhlYXRlciBmcm9tICdAY29tcG9uZW50L2FkbWluL2NpbmVtYV90aGVhdGVyL0NpbmVtYVRoZWF0ZXIuanN4JztcbmltcG9ydCBTZWF0TWFwIGZyb20gJ0Bjb21wb25lbnQvYWRtaW4vc2VhdC9TZWF0TWFwJztcbmltcG9ydCBHb29nbGVDYWxsYmFjayBmcm9tICdAcGFnZXMvYXV0aC9Hb29nbGVDYWxsYmFjayc7XG5cbmNvbnN0IHJvdXRlciA9IGNyZWF0ZUJyb3dzZXJSb3V0ZXIoW1xuICB7XG4gICAgZWxlbWVudDogPFJvb3RMYXlvdXQgLz4sXG4gICAgY2hpbGRyZW46IFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJy8nLFxuICAgICAgICBlbGVtZW50OiA8SG9tZVBhZ2UgLz4sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAnL2RldGFpbC1tb3ZpZS86aWQnLFxuICAgICAgICBlbGVtZW50OiA8RGV0YWlsTW92aWVQYWdlIC8+LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJy9tb3ZpZScsXG4gICAgICAgIGVsZW1lbnQ6IDxNb3ZpZVBhZ2UgLz4sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBlbGVtZW50OiA8UHJvdGVjdGVkUm91dGUgLz4sXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGF0aDogJy9jaG9vc2Utc2VhdCcsXG4gICAgICAgICAgICBlbGVtZW50OiA8Q2hvb3NlU2VhdFBhZ2UgLz4sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGVsZW1lbnQ6IDxBdXRoTGF5b3V0IC8+LFxuICAgICAgICBwYXRoOiAnL2F1dGgnLFxuICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgICAgICAgcGF0aDogJ2xvZ2luJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxMb2dpblBhZ2UgLz4sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwYXRoOiAnZ29vZ2xlL2NhbGxiYWNrJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxHb29nbGVDYWxsYmFjayAvPixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcblxuICAgICAge1xuICAgICAgICBlbGVtZW50OiA8QWRtaW5Sb3V0ZSAvPixcbiAgICAgICAgcGF0aDogJy9hZG1pbicsXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5kZXg6IHRydWUsXG4gICAgICAgICAgICBwYXRoOiAnZGFzaGJvYXJkJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxEYXNoQm9hcmRQYWdlIC8+LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGF0aDogJ3Rob25nLWtlJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxTdGF0aXN0aWNhbFBhZ2UgLz4sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwYXRoOiAnaGUtdGhvbmctcmFwJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxUaGVhdGVyU3lzdGVtUGFnZSAvPixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhdGg6ICdjaGktbmhhbmgnLFxuICAgICAgICAgICAgZWxlbWVudDogPHA+Q2hpIG5oYW5oPC9wPixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhdGg6ICdyYXAnLFxuICAgICAgICAgICAgZWxlbWVudDogPHA+UXXhuqNuIGzDvSBy4bqhcDwvcD4sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwYXRoOiAnc28tZG8tZ2hlJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxwPlF14bqjbiBsw70gc8ahIMSR4buTIGdo4bq/PC9wPixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhdGg6ICdzby1kby1naGUvOmlkJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxTZWF0TWFwIC8+LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGF0aDogJ3Bob25nLWNoaWV1JyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxDaW5lbWFUaGVhdGVyIC8+LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGF0aDogJ3RoZS10aGFuaC12aWVuJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxwPlF14bqjbiBsw70gdGjhursgdGjDoG5oIHZpw6puPC9wPixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhdGg6ICd4dWF0LWNoaWV1JyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxwPlF14bqjbiBsw70geHXhuqV0IGNoaeG6v3U8L3A+LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGF0aDogJ3BoaW0nLFxuICAgICAgICAgICAgZWxlbWVudDogPHA+UXXhuqNuIGzDvSBwaGltPC9wPixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhdGg6ICdob2EtZG9uJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxwPlF14bqjbiBsw70gaMOzYSDEkcahbjwvcD4sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwYXRoOiAnZG8tYW4nLFxuICAgICAgICAgICAgZWxlbWVudDogPHA+UXXhuqNuIGzDvSDEkeG7kyDEg248L3A+LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGF0aDogJ2NvbWJvJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxwPlF14bqjbiBsw70gY29tYm88L3A+LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGF0aDogJ21hLWdpYW0tZ2lhJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxwPlF14bqjbiBsw70gbcOjIGdp4bqjbSBnacOhPC9wPixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhdGg6ICdnaWEtdmUnLFxuICAgICAgICAgICAgZWxlbWVudDogPHA+UXXhuqNuIGzDvSBnacOhIHbDqTwvcD4sXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhdGg6ICduZ3VvaS1kdW5nJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxwPlF14bqjbiBsw70gbmfGsOG7nWkgZMO5bmc8L3A+LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGF0aDogJ3ZhaS10cm8nLFxuICAgICAgICAgICAgZWxlbWVudDogPHA+UXXhuqNuIGzDvSB2YWkgdHLDsjwvcD4sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwYXRoOiAncXV5ZW4taGFuJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6IDxwPlF14bqjbiBsw70gcXV54buBbiBo4bqhbjwvcD4sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbl0pO1xuY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKS5yZW5kZXIoXG4gIC8vIDxTdHJpY3RNb2RlPlxuICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICA8UGVyc2lzdEdhdGUgbG9hZGluZz17PHA+TG9hZGluZyAuLi48L3A+fSBwZXJzaXN0b3I9e3BlcnNpc3Rvcn0+XG4gICAgICA8VGhlbWVQcm92aWRlciB0aGVtZT17dGhlbWV9PlxuICAgICAgICA8Um91dGVyUHJvdmlkZXIgcm91dGVyPXtyb3V0ZXJ9IC8+XG4gICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgPC9QZXJzaXN0R2F0ZT5cbiAgPC9Qcm92aWRlcj5cbiAgLy97LyogPC9TdHJpY3RNb2RlPiAqL31cbik7XG4iXSwiZmlsZSI6IkQ6LzEuRlBULUNvbGxlZ2UvREFUTi9zZXR1cC9jaW5lbWFuLWFwcC9zcmMvbWFpbi5qc3gifQ==