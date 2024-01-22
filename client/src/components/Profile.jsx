import { Link } from "react-router-dom"
import avatar from '../assets/profile.png'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { registerValidation } from "../helper/validate"
import { convertToBase64 } from "../helper/convert"
import { useState } from "react"

import styles from '../styles/Username.module.css'
import extend from '../styles/Profile.module.css'

export default function Profile() {

  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      address: '',
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || '' })
      console.log(values)
    }
  })

  // formik does not support file upload 
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);

  }

  return (
    <div className="container mx-auto">

      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className=" flex justify-center items-center h-screen">

        <div className={`${styles.glass} ${extend.glass}`} style={{ width: "45%", paddingTop: '3em' }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-3/4 text-center text-gray-500">You can update the details.</span>
          </div>

          <form onSubmit={formik.handleSubmit} className="py-1">
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={file || avatar} alt="avatar" className={`${styles.profile_img} ${extend.profile_img}`} />
              </label>

              <input type="file" id="profile" name="profile" onChange={onUpload} />
            </div>

            <div className="textbox flex flex-col items-center gap-6">

              <div className={extend.name}>
                <input type="text" placeholder="First Name" className={`${styles.textbox} ${extend.textbox}`} {...formik.getFieldProps('firstName')} />
                <input type="text" placeholder="Last Name" className={`${styles.textbox} ${extend.textbox}`} {...formik.getFieldProps('lastName')} />
              </div>

              <div className={extend.name}>
                <input type="text" placeholder="Mobile No." className={`${styles.textbox} ${extend.textbox}`} {...formik.getFieldProps('mobile')} />
                <input type="text" placeholder="Email" className={`${styles.textbox} ${extend.textbox}`} {...formik.getFieldProps('email')} />
              </div>
              <div className={extend.name}>
                <input type="text" placeholder="Address" className={`${styles.textbox} ${extend.textbox} w-full`} {...formik.getFieldProps('address')} />
              </div>
                <button className={`${styles.btn} ${extend.textbox}`} type="submit">Register</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">come back later? <Link className={styles.btn_link} to="/">Logout</Link> </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
