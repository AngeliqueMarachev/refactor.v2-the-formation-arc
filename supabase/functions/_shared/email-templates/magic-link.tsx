/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ confirmationUrl }: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your sign-in link for The Formation Arc</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your sign-in link</Heading>
        <Text style={text}>
          Use the link below to sign in to The Formation Arc. It will expire
          shortly.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Sign in
        </Button>
        <Text style={footer}>
          If you didn't request this link, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Nunito, Helvetica, Arial, sans-serif',
}
const container = { padding: '32px 28px', maxWidth: '520px' }
const h1 = {
  fontFamily: 'Fraunces, Georgia, serif',
  fontSize: '26px',
  fontWeight: 500 as const,
  color: '#0C4651',
  margin: '0 0 24px',
  lineHeight: '1.25',
}
const text = {
  fontSize: '15px',
  color: '#5a6a6e',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const button = {
  backgroundColor: '#0C4651',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 600 as const,
  borderRadius: '14px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
}
const footer = {
  fontSize: '13px',
  color: '#8a9598',
  lineHeight: '1.6',
  margin: '32px 0 0',
}
