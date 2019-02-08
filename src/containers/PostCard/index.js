import PostCard from './PostCard'
import enhance from './PostCard.enhancer'
import { pure } from 'recompose'

export default pure(enhance(PostCard))
