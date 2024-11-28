;; Decentralized Autonomous Language Evolution Platform

;; Constants
(define-constant ERR_UNAUTHORIZED (err u403))
(define-constant ERR_NOT_FOUND (err u404))
(define-constant ERR_ALREADY_EXISTS (err u409))

;; Data vars
(define-data-var word-counter uint u0)
(define-data-var rule-counter uint u0)
(define-data-var translation-counter uint u0)

;; Maps
(define-map words
  { id: uint }
  { creator: principal, word: (string-ascii 50), meaning: (string-ascii 100), votes: uint, status: (string-ascii 20) })

(define-map grammatical-rules
  { id: uint }
  { creator: principal, description: (string-ascii 200), votes: uint, status: (string-ascii 20) })

(define-map phonetic-changes
  { id: uint }
  { creator: principal, description: (string-ascii 200), votes: uint, status: (string-ascii 20) })

(define-map word-ownership
  { word-id: uint, owner: principal }
  { shares: uint })

(define-map translations
  { id: uint }
  { source-word: (string-ascii 50), target-word: (string-ascii 50), language: (string-ascii 50) })

(define-map user-scores
  { user: principal }
  { score: uint })

;; Functions
(define-public (propose-word (word (string-ascii 50)) (meaning (string-ascii 100)))
  (let ((word-id (+ (var-get word-counter) u1)))
    (map-set words
      { id: word-id }
      { creator: tx-sender, word: word, meaning: meaning, votes: u0, status: "proposed" })
    (var-set word-counter word-id)
    (ok word-id)))

(define-public (vote-word (word-id uint))
  (let ((word (unwrap! (map-get? words { id: word-id }) ERR_NOT_FOUND))
        (current-score (default-to { score: u0 } (map-get? user-scores { user: tx-sender }))))
    (map-set words
      { id: word-id }
      (merge word { votes: (+ (get votes word) u1) }))
    (map-set user-scores
      { user: tx-sender }
      { score: (+ (get score current-score) u1) })
    (ok true)))

(define-public (approve-word (word-id uint))
  (let ((word (unwrap! (map-get? words { id: word-id }) ERR_NOT_FOUND)))
    (asserts! (is-eq (get votes word) u10) ERR_UNAUTHORIZED) ;; Require 10 votes to approve
    (map-set words
      { id: word-id }
      (merge word { status: "approved" }))
    (mint-word-nft word-id (get creator word))
    (ok true)))

(define-public (propose-grammatical-rule (description (string-ascii 200)))
  (let ((rule-id (+ (var-get rule-counter) u1)))
    (map-set grammatical-rules
      { id: rule-id }
      { creator: tx-sender, description: description, votes: u0, status: "proposed" })
    (var-set rule-counter rule-id)
    (ok rule-id)))

(define-public (vote-grammatical-rule (rule-id uint))
  (let ((rule (unwrap! (map-get? grammatical-rules { id: rule-id }) ERR_NOT_FOUND))
        (current-score (default-to { score: u0 } (map-get? user-scores { user: tx-sender }))))
    (map-set grammatical-rules
      { id: rule-id }
      (merge rule { votes: (+ (get votes rule) u1) }))
    (map-set user-scores
      { user: tx-sender }
      { score: (+ (get score current-score) u1) })
    (ok true)))

(define-public (approve-grammatical-rule (rule-id uint))
  (let ((rule (unwrap! (map-get? grammatical-rules { id: rule-id }) ERR_NOT_FOUND)))
    (asserts! (is-eq (get votes rule) u20) ERR_UNAUTHORIZED) ;; Require 20 votes to approve
    (map-set grammatical-rules
      { id: rule-id }
      (merge rule { status: "approved" }))
    (ok true)))

(define-public (propose-phonetic-change (description (string-ascii 200)))
  (let ((change-id (+ (var-get rule-counter) u1)))
    (map-set phonetic-changes
      { id: change-id }
      { creator: tx-sender, description: description, votes: u0, status: "proposed" })
    (var-set rule-counter change-id)
    (ok change-id)))

(define-public (vote-phonetic-change (change-id uint))
  (let ((change (unwrap! (map-get? phonetic-changes { id: change-id }) ERR_NOT_FOUND))
        (current-score (default-to { score: u0 } (map-get? user-scores { user: tx-sender }))))
    (map-set phonetic-changes
      { id: change-id }
      (merge change { votes: (+ (get votes change) u1) }))
    (map-set user-scores
      { user: tx-sender }
      { score: (+ (get score current-score) u1) })
    (ok true)))

(define-public (approve-phonetic-change (change-id uint))
  (let ((change (unwrap! (map-get? phonetic-changes { id: change-id }) ERR_NOT_FOUND)))
    (asserts! (is-eq (get votes change) u20) ERR_UNAUTHORIZED) ;; Require 20 votes to approve
    (map-set phonetic-changes
      { id: change-id }
      (merge change { status: "approved" }))
    (ok true)))

(define-private (mint-word-nft (word-id uint) (recipient principal))
  (map-set word-ownership
    { word-id: word-id, owner: recipient }
    { shares: u100 })) ;; Give 100% ownership to the creator

(define-public (transfer-word-ownership (word-id uint) (recipient principal) (shares uint))
  (let (
    (current-ownership (unwrap! (map-get? word-ownership { word-id: word-id, owner: tx-sender }) ERR_UNAUTHORIZED))
    (recipient-ownership (default-to { shares: u0 } (map-get? word-ownership { word-id: word-id, owner: recipient })))
  )
    (asserts! (>= (get shares current-ownership) shares) ERR_UNAUTHORIZED)
    (map-set word-ownership
      { word-id: word-id, owner: tx-sender }
      { shares: (- (get shares current-ownership) shares) })
    (map-set word-ownership
      { word-id: word-id, owner: recipient }
      { shares: (+ (get shares recipient-ownership) shares) })
    (ok true)))

(define-public (add-translation (source-word (string-ascii 50)) (target-word (string-ascii 50)) (language (string-ascii 50)))
  (let ((translation-id (+ (var-get translation-counter) u1)))
    (map-set translations
      { id: translation-id }
      { source-word: source-word, target-word: target-word, language: language })
    (var-set translation-counter translation-id)
    (ok translation-id)))

;; Read-only functions
(define-read-only (get-word (word-id uint))
  (map-get? words { id: word-id }))

(define-read-only (get-grammatical-rule (rule-id uint))
  (map-get? grammatical-rules { id: rule-id }))

(define-read-only (get-phonetic-change (change-id uint))
  (map-get? phonetic-changes { id: change-id }))

(define-read-only (get-word-ownership (word-id uint) (owner principal))
  (map-get? word-ownership { word-id: word-id, owner: owner }))

(define-read-only (get-translation (translation-id uint))
  (map-get? translations { id: translation-id }))

(define-read-only (get-user-score (user principal))
  (default-to { score: u0 } (map-get? user-scores { user: user })))

(define-read-only (get-word-count)
  (var-get word-counter))

(define-read-only (get-grammatical-rule-count)
  (var-get rule-counter))

(define-read-only (get-phonetic-change-count)
  (var-get rule-counter))

