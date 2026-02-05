import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    if (token) {
      authService.verifyEmail(token)
        .then(() => {
          setStatus("success");
          setTimeout(() => navigate("/login"), 2000);
        })
        .catch((err) => {
          setStatus("error");
        });
    }
  }, [token, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      {status === "loading" && <Spinner>Verifying</Spinner>}

      {status === "success" && (
        <div className="text-center">
          <p className="font-bold text-xl">Verify success</p>
          <p>Back to login</p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <p className="text-red-500 font-bold">Verify fail</p>
          <button onClick={() => navigate("/login")} className=" underline">
            Back to login
          </button>
        </div>
      )}
    </div>
  );
}