import toast, { Toaster } from 'react-hot-toast'
import { useAuthStore } from '../store/store'
import styles from '../styles/Username.module.css'
import { useEffect, useState } from 'react'
import { generateOTP, verifyOTP } from '../helper/helper.js'
import { useNavigate } from 'react-router-dom'
export default function Recovery() {

  const { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      if (OTP) return toast.success('OTP has been sent to your email!');
      return toast.error('Problem while generating OTP!');
    })
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();
    let { status } = await verifyOTP({ username, code: OTP });
    if (status === 201) {
      toast.success('Verify Successfuly!');
      return navigate('/reset');
    }

    return toast.error('Wrong OTP! Check email again!');
  }

  // handler function resend OTP
  function resendOTP() {
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: 'Sending...',
      success: <b>OTP has been send to your email!</b>,
      error: <b>Could not send it!</b>
    });

    sendPromise.then((OTP) => {
      console.log(OTP);
    })
  }


  return (
    <div className="container mx-auto">

      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className=" flex justify-center items-center h-screen">

        <div className={styles.glass} style={{ width: "50%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-3/4 text-center text-gray-500">Enter OTP to recover password.</span>
          </div>

          <form className="py-1" onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center w-full">
                <span className="block py-4 text-sm text-center text-gray-500">Enter 6 digit OTP sent to your email address</span>
                <input id='OTP' type="text" placeholder="OTP" className={styles.textbox} onChange={(e) => setOTP(e.target.value)} />
              </div>
              <button className={styles.btn} type="submit">Recover</button>
            </div>
          </form>
            <div className="text-center py-4">
            <span className="text-gray-500">Can&#39;t get OTP? <button onClick={resendOTP} className={styles.btn_link}  >Resend</button> </span>
          </div>
        </div>
      </div>
    </div>
  )
}
