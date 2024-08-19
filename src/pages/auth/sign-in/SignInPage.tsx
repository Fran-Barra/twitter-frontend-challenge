import { useState } from "react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import AuthWrapper from "../AuthWrapper";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import { SingInData } from "../../../service";
import { Form, Formik } from "formik";

interface SignInForm {
  nameOrMail: string;
  password: string;
}

const SignInPage = () => {
  const [error, setError] = useState(false);

  const httpRequestService = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (values: SignInForm) => {
    const credentials : SingInData = values.nameOrMail.includes('@') ? 
      {email: values.nameOrMail, password: values.password} : 
      {username: values.nameOrMail, password: values.password} 
    
    httpRequestService
      .signIn(credentials)
      .then(() => navigate("/"))
      .catch(() => setError(true));
  };

  return (
    <Formik
      initialValues={{nameOrMail: '', password: ''}}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <AuthWrapper>
            <div className={"border"}>
              <div className={"container"}>
                <div className={"header"}>
                  <img src={logo} alt={"Twitter Logo"} />
                  <StyledH3>{t("title.login")}</StyledH3>
                </div>
                <div className={"input-container"}>
                  <LabeledInput
                    name={"nameOrMail"}
                    required
                    placeholder={"Enter user..."}
                    title={t("input-params.username")}
                  />
                  <LabeledInput
                    name={"password"}
                    type="password"
                    required
                    placeholder={"Enter password..."}
                    title={t("input-params.password")}
                  />
                  <p className={"error-message"}>{error && t("error.login")}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Button
                    text={t("buttons.login")}
                    buttonType={ButtonType.FOLLOW}
                    size={"MEDIUM"}
                    type="submit"
                  />
                  <Button
                    text={t("buttons.register")}
                    buttonType={ButtonType.OUTLINED}
                    size={"MEDIUM"}
                    onClick={() => navigate("/sign-up")}
                  />
                </div>
              </div>
            </div>
          </AuthWrapper>
        </Form>
      )}
    </Formik>
  );
};

export default SignInPage;
