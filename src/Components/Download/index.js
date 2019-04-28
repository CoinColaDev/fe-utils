import React from 'react'
import styles from './styles'

export default class Download extends React.Component {
  render() {
    const { title, desc, okText, onClose, onOk } = this.props
    return (
      <div style={styles.libDownload}>
        <div
          style={styles.libClose}
          onClick={() => {
            onClose && onClose()
          }}
        >
          <span style={styles.libCloseBtn} />
        </div>
        <div style={styles.libInnerLogo} />
        <div style={styles.libInnerContent}>
          <div style={styles.libInnerTitle}>{title || 'title'}</div>
          <div style={styles.libInnerDesc}>{desc || 'desc'}</div>
        </div>
        <div
          style={styles.libRedirect}
          onClick={() => {
            onOk && onOk()
          }}
        >
          {okText || 'okText'}
        </div>
      </div>
    )
  }
}

