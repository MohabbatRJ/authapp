import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { resetPasswordValidate } from "../helper/validate"

import styles from '../styles/Username.module.css'

export default function Reset() {

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_password: '',
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values)
    }
  })

  return (
    <div className="container mx-auto">

      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className=" flex justify-center items-center h-auto sm:h-screen">

        <div className={styles.glass} style={{ width: "50%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-3/4 text-center text-gray-500">Enter new password.</span>
          </div>

          <form onSubmit={formik.handleSubmit} className="py-1">
            <div className="textbox flex flex-col items-center gap-6">
              <input type="password" placeholder="New Password" className={styles.textbox} {...formik.getFieldProps('password')} />
              <input type="password" placeholder="Repeat Password" className={styles.textbox} {...formik.getFieldProps('confirm_password')} />
              <button className={styles.btn} type="submit">Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
