import * as s from './badgeCard.css'

type Props = {
  label: string
  title: string
  sub: string
}

export const BadgeCard = ({ label, title, sub }: Props) => (
  <div className={s.card}>
    <p className={s.label}>{label}</p>
    <p className={s.title}>{title}</p>
    <p className={s.sub}>{sub}</p>
  </div>
)
