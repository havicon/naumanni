import React from 'react'
import PropTypes from 'prop-types'

import {UIColumn} from 'src/models'
import {DropdownMenuButton, IconFont, NowLoading} from 'src/pages/parts'
import CloseColumnUseCase from 'src/usecases/CloseColumnUseCase'


/**
 * カラムのベースクラス
 */
export default class Column extends React.Component {
  static contextTypes = {
    context: PropTypes.any,
  }

  static propTypes = {
    column: PropTypes.instanceOf(UIColumn).isRequired,
  }

  constructor(...args) {
    super(...args)

    this.state = this.getStateFromContext()
  }

  /**
   * @override
   */
  componentDidMount() {
    // update accounts
    const {context} = this.context

    this.listenerRemovers = [
      context.onChange(::this.onChangeConext),
    ]
  }

  /**
   * @override
   */
  componentWillUnmount() {
    for(const remover of this.listenerRemovers) {
      remover()
    }
  }

  /**
   * @override
   */
  render() {
    const {loading} = this.state
    let title = this.renderTitle()

    if(typeof title === 'string')
      title = <h1 className="column-headerTitle">{title}</h1>

    let columnBodyClassName = ['column-body']

    if(loading)
      columnBodyClassName.push('is-loading')

    return (
      <div className="column">
        <header className="column-header">
          {title}
          <div className="column-headerMenu">
            <DropdownMenuButton onRenderMenu={::this.onRenderColumnMenu}>
              <button className="column-headerMenuButton"><IconFont iconName="cog" /></button>
            </DropdownMenuButton>
          </div>
        </header>

        <div className={columnBodyClassName.join(' ')}>
          {loading ? <NowLoading /> : this.renderBody()}
        </div>
      </div>
    )
  }

  onChangeConext() {
    this.setState(this.getStateFromContext())
  }

  getStateFromContext() {
    const {context} = this.context
    return context.getState()
  }

  onRenderColumnMenu() {
    return (
      <ul className="menu menu--column">
        <li className="menu-item"
          onClick={::this.onClickCloseColumn}
          >
          <span className="menu-itemLabel">閉じる</span>
        </li>

      </ul>
    )
  }

  onClickCloseColumn() {
    const {context} = this.context
    context.useCase(new CloseColumnUseCase()).execute(this.props.column)
  }
}