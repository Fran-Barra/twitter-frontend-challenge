import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { StyledSideBarPageWrapper } from "../../pages/side-bar-page/SideBarPageWrapper";
import NavBar from "../navbar/NavBar";
import SignUpPage from "../../pages/auth/sign-up/SignUpPage";
import SignInPage from "../../pages/auth/sign-in/SignInPage";
import HomePage from "../../pages/home-page/HomePage";
import RecommendationPage from "../../pages/recommendation/RecommendationPage";
import ProfilePage from "../../pages/profile/ProfilePage";
import TweetPage from "../../pages/create-tweet-page/TweetPage";
import CommentPage from "../../pages/create-comment-page/CommentPage";
import PostPage from "../../pages/post-page/PostPage";
import isAuthenticated from "../../service/isAuthenticated";

const WithNav = () => {
  return (
    <StyledSideBarPageWrapper>
      <NavBar />
      <Outlet />
    </StyledSideBarPageWrapper>
  );
};

const ProtectedRoute = ({ isAuthenticated } : { isAuthenticated : ()=>boolean }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/sign-in" replace />
  }

  return <WithNav />
}


export const ROUTER = createBrowserRouter([
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    element: <ProtectedRoute isAuthenticated={isAuthenticated}/>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/recommendations",
        element: <RecommendationPage />,
      },
      {
        path: "/profile/:id",
        element: <ProfilePage />,
      },
      {
        path: "/post/:id",
        element: <PostPage />,
      },
      {
        path: "/compose/tweet",
        element: <TweetPage />,
      },
      {
        path: "/post/:id",
        element: <CommentPage />,
      },
    ],
  },
]);
