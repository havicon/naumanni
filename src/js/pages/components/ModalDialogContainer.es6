import React from 'react'
import PropTypes from 'prop-types'

import {DIALOG_ADD_ACCOUNT, DIALOG_AUTHORIZE_ACCOUNT, DIALOG_MEDIA_VIEWER} from 'src/constants'
import {UIDialogPropType} from 'src/propTypes'

/**
 * ダイアログのコンテナ
 */
export default class ModalDialogContainer extends React.Component {
  static propTypes = {
    dialogs: PropTypes.arrayOf(UIDialogPropType).isRequired,
  }

  /**
   * @override
   */
  render() {
    const {dialogs} = this.props

    if(!dialogs.length)
      return null

    return (
      <div className="modalDialogContainer" onClick={::this.onClickBackground}>
        {dialogs.map((dialog, idx) => {
          const dialogClass = this.dialogClassByType(dialog.type)

          return React.createElement(
            dialogClass, {
              key: dialog.key,
              dialog: dialog,
              visible: idx === dialogs.length - 1 ? true : false,
              ref: idx === dialogs.length - 1 ? 'top' : null,
              ...dialog.params,
            })
        })}
      </div>
    )
  }

  // TODO:しょぼい
  dialogClassByType(type) {
    switch(type) {
    case DIALOG_ADD_ACCOUNT: return require('src/pages/dialogs/AddAccountDialog').default
    case DIALOG_AUTHORIZE_ACCOUNT: return require('src/pages/dialogs/AuthorizeAccountDialog').default
    case DIALOG_MEDIA_VIEWER: return require('src/pages/dialogs/MediaViewerDialog').default
    default: require('assert')(0, 'invalid dialog type')
    }
  }

  onClickBackground(e) {
    const dialog = this.refs.top

    if(dialog.onClickBackground)
      dialog.onClickBackground(e)
  }
}
