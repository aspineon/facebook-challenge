import Post from './Post'
import enhance from './Post.enhancer'
import { pure } from 'recompose'

export default pure(enhance(Post))
