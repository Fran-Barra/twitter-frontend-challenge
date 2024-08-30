import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthWrapper from "../../../pages/auth/AuthWrapper";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import axios, { HttpStatusCode } from "axios";
import { Form, Formik, FormikErrors } from "formik";

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const SignUpPage = () => {
  const [error, setError] = useState<{error: boolean, code?: number}>({error: false});

  const httpRequestService = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (values: SignUpData) => {
    const { confirmPassword, ...requestData } = values;
    httpRequestService
      .signUp(requestData)
      .then(() => navigate("/"))
      .catch((e) => {
        if (axios.isAxiosError(e)) setError({error: true, code: e.status || e.response?.status})
        else setError({error: true})
      });
  };

  const handleValidate : (values: SignUpData) => FormikErrors<SignUpData> = (values : SignUpData) => {
    let errors: FormikErrors<SignUpData> = {};

    if (values.name) {
      if (values.name.includes('@')) {
        errors.name = t('error.sign-up.name-with-@')
      } else if (values.name.length < 4 || values.name.length > 20) {
        errors.name = t('error.sign-up.name-size')
      }
    }

    if (!values.username) {
      errors.username = t('error.sign-up.required')
    } else if (values.username.includes('@')) {
      errors.username = t('error.sign-up.name-with-@')
    } else if (values.username.length < 4 || values.username.length > 20) {
      errors.username = t('error.sign-up.username-size')
    }

    if (!values.email) {
      errors.email = t('error.sign-up.required')
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = t('error.sign-up.not-valid-mail')
    }

    if (!values.password) {
      errors.password = t('error.sign-up.required')
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/.test(values.password)) {
      errors.password = t('error.sign-up.password')
    }
    
    if (!values.confirmPassword) {
      errors.confirmPassword = t('error.sign-up.required')
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = t('error.sign-up.ps-must-match')
      errors.password = t('error.sign-up.ps-must-match')
    }

    return errors
  }

  const errorToShow : ()=>string = () => {        
    if (error.code === HttpStatusCode.BadRequest) return t('error.sign-up.password')
    if (error.code === HttpStatusCode.Conflict) return t('error.sign-up.user-exists')
    return t('error.unexpected')
  }

  return (
    <Formik 
      initialValues={{name: '', username: '', email: '', password: '', confirmPassword: ''}}
      onSubmit={handleSubmit}
      validate={handleValidate}
      validateOnChange={false}
    >
      {({ isSubmitting }) => (
        <Form>
          <AuthWrapper>
            <div className={"border"}>
              <div className={"container"}>
                <div className={"header"}>
                    <img src={logo} alt="Twitter Logo" />
                    <StyledH3>{t("title.register")}</StyledH3>
                </div>
                <div className={"input-container"}>
                    <LabeledInput
                      required
                      name="name"
                      placeholder={"Enter name..."}
                      title={t("input-params.name")}
                    />
                    <LabeledInput
                      required
                      name="username"
                      placeholder={"Enter username..."}
                      title={t("input-params.username")}
                    />
                    <LabeledInput
                      required
                      name="email"
                      placeholder={"Enter email..."}
                      title={t("input-params.email")}
                    />
                    <LabeledInput
                      type="password"
                      required
                      name="password"
                      placeholder={"Enter password..."}
                      title={t("input-params.password")}
                    />
                    <LabeledInput
                      type="password"
                      required
                      name="confirmPassword"
                      placeholder={"Confirm password..."}
                      title={t("input-params.confirm-password")}
                    />
                    {error.error ? <p className={"error-message"}>{error.error && errorToShow()}</p> : null}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Button
                    text={t("buttons.register")}
                    buttonType={ButtonType.FOLLOW}
                    size={"MEDIUM"}
                    type="submit"
                  />
                  <Button
                    text={t("buttons.login")}
                    buttonType={ButtonType.OUTLINED}
                    size={"MEDIUM"}
                    onClick={() => navigate("/sign-in")}
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

export default SignUpPage;
