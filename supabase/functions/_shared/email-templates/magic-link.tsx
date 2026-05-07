/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  token: string
}

export const MagicLinkEmail = ({ token }: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your sign-in code for The Formation Arc</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your sign-in code</Heading>
        <Text style={text}>
          Enter this code in The Formation Arc to continue. It expires shortly.
        </Text>
        <Section style={codeWrap}>
          <Text style={code}>{token}</Text>
        </Section>
        <Text style={footer}>
          If you didn't request this code, you can safely ignore this email.
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
const codeWrap = {
  backgroundColor: '#F1F5F4',
  borderRadius: '14px',
  padding: '20px 24px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}
const code = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontSize: '32px',
  fontWeight: 600 as const,
  color: '#0C4651',
  letterSpacing: '0.4em',
  margin: 0,
  lineHeight: '1.2',
}
const footer = {
  fontSize: '13px',
  color: '#8a9598',
  lineHeight: '1.6',
  margin: '32px 0 0',
}
