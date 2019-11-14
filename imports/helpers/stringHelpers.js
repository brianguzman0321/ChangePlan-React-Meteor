
/***** Return Capitalize String i.e From `meteor` to `Meteor` *****/
// @word string (required) if given then append
export const stringHelpers = {
    capitalize(word){
        if(typeof word === 'string')
            return word.charAt(0).toUpperCase() + word.slice(1);
    },
    limitCharacters(sentence, limit){
        if(typeof sentence === 'string')
            return sentence.length < limit ? sentence : sentence.slice(0, limit - 2).concat('...')
    }
};