// 'use client';

// import type { AppProps } from 'next/app';
// import {
//   ColorSchemeScript,
//   Loader,
//   MantineProvider,
//   MantineThemeOverride,
// } from "@mantine/core";
// import { theme as baseTheme } from "@repo/theme/mantine";
// import { Notifications } from "@mantine/notifications";
// import { Suspense } from "react";
// import { Provider } from "react-redux";
// import RootAdminLayout from './components/layout';
// import { store } from './store';

// function MyApp({ Component, pageProps }: AppProps) {
//   const theme: Partial<MantineThemeOverride> = baseTheme;

//   return (
//     <MantineProvider theme={theme}>
//       <ColorSchemeScript />
//       <Notifications position="top-right" />
//       <Suspense fallback={<Loader />}>
//         <Provider store={store}>
//           <RootAdminLayout>
//             <Component {...pageProps} />
//           </RootAdminLayout>
//         </Provider>
//       </Suspense>
//     </MantineProvider>
//   );
// }

// export default MyApp;