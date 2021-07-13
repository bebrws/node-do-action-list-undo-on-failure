const currentEmail = "brad@test.com";
const newEmail = "bradNEW@test.com";

let s1 = currentEmail;
let s2 = currentEmail;
let s3 = currentEmail;
let s4 = currentEmail;

function printStatus() {
  console.log(`status: s1 ${s1}  s2 ${s2}   s3 ${s3}   s4 ${s4}`);
}

let s1func = async (
  curentEmail: string,
  newEmail: string
): Promise<boolean> => {
  s1 = newEmail;
  console.log("s1");
  return true;
};

let s2func = async (
  curentEmail: string,
  newEmail: string
): Promise<boolean> => {
  s2 = newEmail;
  console.log("s2");
  return true;
};

let s3func = async (
  curentEmail: string,
  newEmail: string
): Promise<boolean> => {
  // s3 = newEmail;
  console.log("s3");
  return false;
};

let s4func = async (
  curentEmail: string,
  newEmail: string
): Promise<boolean> => {
  s4 = newEmail;
  console.log("s4");
  return true;
};

const allUpdateFuncs = [s1func, s2func, s3func, s4func];
async function executeAndReverseOnFailure(
  allUpdateFuncs: Array<Function>,
  updateArguments: Array<any>,
  argumentAugmenterOnFailure: (args: Array<any>) => Array<any>
) {
  const results = (await Promise.all(
    allUpdateFuncs.map(async (func) => {
      return await func.apply(this, updateArguments);
    })
  )) as boolean[];
  if (results.some((res) => res === false)) {
    const allUndoUpdateFuncs = results.reduce((acc, cur, index, arr) => {
      if (cur) {
        return [...acc, allUpdateFuncs[index]];
      } else {
        return acc;
      }
    }, []) as ((curentEmail: string, newEmail: string) => Promise<boolean>)[];

    const undoResults = (await Promise.all(
      allUndoUpdateFuncs.map(async (func) => {
        return await func.apply(
          this,
          argumentAugmenterOnFailure(updateArguments)
        );
      })
    )) as boolean[];
    if (undoResults.some((res) => res === false)) {
      return { allSucceeded: false, undoSucceeded: false };
    } else {
      return { allSucceeded: false, undoSucceeded: true };
    }
  } else {
    return { allSucceeded: true };
  }
}

async function main() {
  printStatus();

  const res = await executeAndReverseOnFailure(
    allUpdateFuncs,
    [currentEmail, newEmail],
    ([currentEmail, newEmail]) => [newEmail, currentEmail]
  );

  console.log("Results from execution with undo", res);

  printStatus();
}

main().then(() => {});
