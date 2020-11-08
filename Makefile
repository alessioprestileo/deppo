# Remove auto-generated folders
install:
	npm install

# Remove auto-generated folders
clean:
	rm -rf coverage dist

# Compile TypeScript files to JS
compile:
	rm -rf ./dist
	npx tsc --skipLibCheck --project "tsconfig.backend.json"

# Starts aplication. Use this on production.
run: compile
	node ./dist/src/backend/cluster

# Starts application in development mode.
dev:
	npx nodemon --watch "./src/backend" --ext ts --exec "make run || exit 1"

# Lint and format code
lint:
	# Lint with tslint
	npx eslint "./src/backend" --ext .ts --config ".eslintrc.backend.js"
	# Format with prettier
	npx prettier --write './src/backend/**/*.ts' --loglevel=error

# Run all tests
test:
	DEPPO_FRONTEND_KEY=test-key npx jest --forceExit --config "jest.config.backend.js"

# Run tests and coverage
coverage:
	npx jest --coverage --forceExit --config "jest.config.backend.js"

# Check types
type-check:
	tsc --pretty --noEmit --skipLibCheck --project "tsconfig.backend.json"

# Compile and run checks before starting application
# Used on Procfile
release: compile

# First run of the app
bootstrap:
	# Install dependencies
	make install
	# If no .env is found, clone and rename ".env.example"
	( ls .env -R 2>/dev/null && echo "=> Skipping .env file creation" ) \
		|| mv .env.example .env && cp .env .env.example
	# Start local databases and application
	make dev

# ---

rules :=	all	\
					dev \
					run \
					test \
					lint \
					clean	\
					release \
					compile	\
					coverage \
					bootstrap \

.PHONY: $(rules)
.SILENT: $(rules)
