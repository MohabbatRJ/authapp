import { Toaster } from 'react-hot-toast'

import styles from '../styles/Username.module.css'

export default function Recovery() {

  return (
    <div className="container mx-auto">

      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className=" flex justify-center items-center h-screen">

        <div className={styles.glass} style={{ width: "50%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-3/4 text-center text-gray-500">Enter OTP to recover password.</span>
          </div>

          <form className="py-1">
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center w-full">
                <span className="block py-4 text-sm text-center text-gray-500">Enter 6 digit OTP sent to your email address</span>
                <input type="text" placeholder="OTP" className={styles.textbox} />
              </div>
              <button className={styles.btn} type="submit">Let&#39;s Go</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">Can&#39;t get OTP? <button className={styles.btn_link}  >Resend</button> </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
